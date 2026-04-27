import { useEffect, useRef, useState } from "react"
import { supabase } from "@/auth/supabaseClient"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function ChangeProfilePicture() {
	const [profilePicture, setProfilePicture] = useState<string>("")
	const [isUploading, setIsUploading] = useState(false)
	const [isRemoving, setIsRemoving] = useState(false)
	const [errorMessage, setErrorMessage] = useState<string>("")

	useEffect(() => {
		async function loadProfilePicture() {
			const {
				data: { user },
				error,
			} = await supabase.auth.getUser()

			if (error || !user) {
				if (error) {
					toast.error("Failed to load profile picture", { description: error.message })
				}
				return
			}

			const savedPicture = user.user_metadata?.profile_picture
			if (typeof savedPicture === "string" && savedPicture.length > 0) {
				setProfilePicture(savedPicture)
			}
		}

		loadProfilePicture()
	}, [])

	async function uploadProfilePicture(file: File) {
		setErrorMessage("")

		if (!file.type.startsWith("image/")) {
			setErrorMessage("Please select an image file.")
			toast.error("Please select an image file")
			return
		}

		setIsUploading(true)

		const {
			data: { user },
			error: userError,
		} = await supabase.auth.getUser()

		if (userError || !user) {
			setErrorMessage("You must be logged in to upload a profile picture.")
			toast.error("You must be logged in to upload a profile picture")
			setIsUploading(false)
			return
		}

		const filePath = `${user.id}/profilepictures/avatar`

		const { error: uploadError } = await supabase.storage
			.from("ProfilesImages")
			.upload(filePath, file, {
				contentType: file.type,
				cacheControl: "0",
				upsert: true,
			})

		if (uploadError) {
			setErrorMessage(`Upload failed: ${uploadError.message}`)
			toast.error("Profile picture upload failed", { description: uploadError.message })
			console.error("Supabase upload failed", {
				bucket: "ProfilesImages",
				filePath,
				error: uploadError,
			})
			setIsUploading(false)
			return
		}

		const { data: publicUrlData } = supabase.storage
			.from("ProfilesImages")
			.getPublicUrl(filePath)

		const nextUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`
		setProfilePicture(nextUrl)

		const { error: updateUserError } = await supabase.auth.updateUser({
			data: {
				profile_picture: nextUrl,
			},
		})

		if (updateUserError) {
			setErrorMessage(`Uploaded image but could not save on user profile: ${updateUserError.message}`)
			toast.error("Image uploaded but profile update failed", { description: updateUserError.message })
			setIsUploading(false)
			return
		}

		toast.success("Profile picture updated successfully")
		setIsUploading(false)
	}

	async function removeProfilePicture() {
		setErrorMessage("")
		setIsRemoving(true)

		const {
			data: { user },
			error: userError,
		} = await supabase.auth.getUser()

		if (userError || !user) {
			setErrorMessage("You must be logged in to remove your profile picture.")
			toast.error("You must be logged in to remove your profile picture")
			setIsRemoving(false)
			return
		}

		const filePath = `${user.id}/profilepictures/avatar`
		const { error: removeError } = await supabase.storage
			.from("ProfilesImages")
			.remove([filePath])

		if (removeError) {
			setErrorMessage(`Failed to remove image: ${removeError.message}`)
			toast.error("Failed to remove profile picture", { description: removeError.message })
			setIsRemoving(false)
			return
		}

		const { error: updateUserError } = await supabase.auth.updateUser({
			data: {
				profile_picture: null,
			},
		})

		if (updateUserError) {
			setErrorMessage(`Image removed but could not update profile: ${updateUserError.message}`)
			toast.error("Image removed but profile update failed", { description: updateUserError.message })
			setIsRemoving(false)
			return
		}

		setProfilePicture("")
		toast.success("Profile picture removed")
		setIsRemoving(false)
	}

	const fileInputRef = useRef<HTMLInputElement>(null)

	return (
		<div className="flex items-center gap-6">
			<div className="relative shrink-0">
				{profilePicture ? (
					<img
						src={profilePicture}
						alt="Profile Picture"
						className="h-24 w-24 rounded-full object-cover ring-2 ring-border"
					/>
				) : (
					<div className="h-24 w-24 rounded-full bg-muted ring-2 ring-border flex items-center justify-center text-muted-foreground text-3xl select-none">
						&#128100;
					</div>
				)}
			</div>

			<div className="flex flex-col gap-2">
				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					className="hidden"
					disabled={isUploading || isRemoving}
					onChange={(e) => {
						if (e.target.files?.[0]) {
							uploadProfilePicture(e.target.files[0])
						}
					}}
				/>
				<Button
                    className="bg-blue-500 text-white"
					variant="outline"
					disabled={isUploading || isRemoving}
					onClick={() => fileInputRef.current?.click()}
				>
					{isUploading ? "Uploading..." : profilePicture ? "Change photo" : "Upload photo"}
				</Button>
				{profilePicture && (
					<Button
						variant="outline"
						className="bg-red-500 text-white"
						disabled={isUploading || isRemoving}
						onClick={removeProfilePicture}
					>
						{isRemoving ? "Removing..." : "Remove photo"}
					</Button>
				)}
				{errorMessage && (
					<p className="text-sm text-destructive">{errorMessage}</p>
				)}
			</div>
		</div>
	)
}
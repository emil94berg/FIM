import { useEffect, useRef, useState } from "react"
import { supabase } from "@/auth/supabaseClient"
import { Button } from "@/components/ui/button"

export function ChangeProfilePicture() {
	const [profilePicture, setProfilePicture] = useState<string>("")
	const [isUploading, setIsUploading] = useState(false)
	const [errorMessage, setErrorMessage] = useState<string>("")

	useEffect(() => {
		async function loadProfilePicture() {
			const {
				data: { user },
				error,
			} = await supabase.auth.getUser()

			if (error || !user) {
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
			return
		}

		setIsUploading(true)

		const {
			data: { user },
			error: userError,
		} = await supabase.auth.getUser()

		if (userError || !user) {
			setErrorMessage("You must be logged in to upload a profile picture.")
			setIsUploading(false)
			return
		}

		const extension = file.name.split(".").pop() || "jpg"
		const filePath = `${user.id}/profilepictures/${crypto.randomUUID()}.${extension}`

		const { error: uploadError } = await supabase.storage
			.from("ProfilesImages")
			.upload(filePath, file, {
				contentType: file.type,
				upsert: false,
			})

		if (uploadError) {
			setErrorMessage(`Upload failed: ${uploadError.message}`)
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

		const nextUrl = publicUrlData.publicUrl
		setProfilePicture(nextUrl)

		const { error: updateUserError } = await supabase.auth.updateUser({
			data: {
				profile_picture: nextUrl,
			},
		})

		if (updateUserError) {
			setErrorMessage(`Uploaded image but could not save on user profile: ${updateUserError.message}`)
		}

		setIsUploading(false)
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
					disabled={isUploading}
					onChange={(e) => {
						if (e.target.files?.[0]) {
							uploadProfilePicture(e.target.files[0])
						}
					}}
				/>
				<Button
                    className="bg-blue-500 text-white"
					variant="outline"
					disabled={isUploading}
					onClick={() => fileInputRef.current?.click()}
				>
					{isUploading ? "Uploading..." : profilePicture ? "Change photo" : "Upload photo"}
				</Button>
				{errorMessage && (
					<p className="text-sm text-destructive">{errorMessage}</p>
				)}
			</div>
		</div>
	)
}
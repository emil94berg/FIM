import { useState } from "react"
import { supabase } from "@/auth/supabaseClient"
import { Button } from "../ui/button";
import { toast } from "sonner"

export function ChangePassword() {
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [isSaving, setIsSaving] = useState(false);

    const updatePassword = async (password: string) => {
        if (!password.trim()) {
            toast.error("Password cannot be empty");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsSaving(true);

        const { error } = await supabase.auth.updateUser({
            password: `${password}`
        })

        setIsSaving(false);

        if (error) {
            toast.error("Failed to update password", { description: error.message });
            return;
        }

        setPassword("");
        setConfirmPassword("");
        toast.success("Password updated successfully");
    }

    return (
        <div className="flex flex-col mt-4 gap-2">
            <input
            className="bg-white"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            />
            <input
            className="bg-white mt-2"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            />
            <Button className="bg-blue-500 text-white" disabled={isSaving} onClick={() => updatePassword(password)}>{isSaving ? "Saving..." : "Change Password"}</Button>
        </div>
    )

}
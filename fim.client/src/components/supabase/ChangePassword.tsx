import { useState } from "react"
import { supabase } from "@/auth/supabaseClient"
import { Button } from "../ui/button";

export function ChangePassword() {
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const updatePassword = async (password: string) => {
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        await supabase.auth.updateUser({
            password: `${password}`
        })
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
            <Button className="bg-blue-500 text-white" onClick={() => updatePassword(password)}>Change Password</Button>
        </div>
    )

}
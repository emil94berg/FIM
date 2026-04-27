import { useEffect, useState } from "react"
import { supabase } from "@/auth/supabaseClient"
import { Button } from "../ui/button";
import { toast } from "sonner"

export function ChangeEmailAddress() {
    const [email, setEmail] = useState<string>("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const loadEmail = async () => {
            try {
                const user = await supabase.auth.getUser();
                if (user) {
                    setEmail(user.data.user?.email || "");
                }
            } catch (error) {
                console.error("Error loading email:", error);
                toast.error("Failed to load email");
            }
        };
        loadEmail();
    }, []);

    const updateEmail = async (email: string) => {
        const trimmed = email.trim();

        if (!trimmed) {
            toast.error("Email cannot be empty");
            return;
        }

        try {
            setIsSaving(true);

            const { error } = await supabase.auth.updateUser({
                email: `${trimmed}`
            });

            setIsSaving(false);

            if (error) {
                toast.error("Failed to update email", { description: error.message });
                return;
            }

            setEmail(trimmed);
            toast.info("Check your inbox to confirm your new email");
        } catch (error) {
            setIsSaving(false);
            console.error("Error updating email:", error);
            toast.error("Failed to update email");
        }
    }

    return (
        <div className="flex flex-col mt-4 gap-2">
            <input className="bg-white" type="email" value={email} placeholder="Your email" onChange={(e) => setEmail(e.target.value)}></input>
            <Button className="bg-blue-500 text-white" disabled={isSaving} onClick={() => updateEmail(email)}>{isSaving ? "Saving..." : "Change Email"}</Button>
        </div>
    )
}

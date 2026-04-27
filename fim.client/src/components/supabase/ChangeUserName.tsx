import { useEffect, useState } from "react"
import { supabase } from "@/auth/supabaseClient"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function ChangeUserName() {
    const [userName, setUserName] = useState<string>("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const loadUserName = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error) {
                toast.error("Failed to load user data");
                return;
            }
            setUserName(data.user?.user_metadata.username || "");
        }
        loadUserName();
    }, []);

    const onChangeUsername = async () => {
        const trimmed = userName.trim()

        if (!trimmed) {
            toast.error("Username cannot be empty");
            return;
        }

        setIsSaving(true);

        const { error } = await supabase.auth.updateUser({
            data: {
                username: trimmed
            }
        })

        setIsSaving(false);

        if (error) {
            toast.error("Failed to update username", { description: error.message });
            return;
        }

        setUserName(trimmed);
        toast.success("Username updated successfully");
    }

    

    return (
        <div className="flex flex-col mt-4 gap-2">
            <input className="bg-white" type="text" value={userName} placeholder="Your username" onChange={(e) => setUserName(e.target.value)}></input>
            <Button className="bg-blue-500 text-white" onClick={onChangeUsername}>{isSaving ? "Saving..." : "Save"}</Button>
        </div>
    )
}
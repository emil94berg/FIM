import { useEffect, useState } from "react"
import { supabase } from "@/auth/supabaseClient"
import { Button } from "../ui/button";

export function ChangeEmailAddress() {
    const [email, setEmail] = useState<string>("");

    useEffect(() => {
        const loadEmail = async () => {
            try {
                const user = await supabase.auth.getUser();
                if (user) {
                    setEmail(user.data.user?.email || "");
                }
            } catch (error) {
                console.error("Error loading email:", error);
            }
        };
        loadEmail();
    }, []);

    const updateEmail = async (email: string) => {
        try {
            await supabase.auth.updateUser({
                email: `${email}`
            });
        } catch (error) {
            console.error("Error updating email:", error);
        }
    }

    return (
        <div className="flex flex-col mt-4 gap-2">
            <input className="bg-white" type="email" value={email} placeholder="Your email" onChange={(e) => setEmail(e.target.value)}></input>
            <Button className="bg-blue-500 text-white" onClick={() => updateEmail(email)}>Change Email</Button>
        </div>
    )
}

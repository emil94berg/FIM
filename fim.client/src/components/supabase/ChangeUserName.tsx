import { useEffect, useState } from "react"
import { supabase } from "@/auth/supabaseClient"
import { Button } from "@/components/ui/button"

export function ChangeUserName() {
    const [userName, setUserName] = useState<string>("");

    useEffect(() => {
        const loadUserName = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                setUserName(user?.user_metadata.username || "");
            }
            catch (error) {
                console.log("Error fetching user data from Supabase... " + error);
            }
        }
        loadUserName();
    }, []);

    const updateUsername = async (username: string) => {
        await supabase.auth.updateUser({
            data: { 
                username: `${username}`
            }
        })
    }

    const onChangeUsername = () => {
        updateUsername(userName);
        setUserName(userName);
    }

    

    return (
        <div className="flex flex-col mt-4 gap-2">
            <input className="bg-white" type="text" value={userName} placeholder="Your username" onChange={(e) => setUserName(e.target.value)}></input>
            <Button className="bg-blue-500 text-white" onClick={onChangeUsername}>Save</Button>
        </div>
    )
}
import { useEffect, useState } from "react"
import { authFetch } from "../../auth/authFetch"
import { supabase } from "@/auth/supabaseClient"
import { Button } from "@/components/ui/button"

export function CreateForumPost() {
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
        <div>
            <h1>{userName}</h1>
            <label>Username:</label>
            <input type="text" onChange={(e) => setUserName(e.target.value)}></input>
            <Button className="bg-blue-500" onClick={onChangeUsername}>Save</Button>
        </div>
    )
}
import { Link } from "react-router-dom"
import { signOut } from "../auth/authService";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"
import { useAuth } from '@/auth/useAuth';
import SseStream from "@/components/notifications/sse/SseStream"

export default function AppHeader() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleSignOut = async () => {
        if (user) {
            await signOut();
        }
        navigate("/login");
    }



    return (
       
        <div className="w-full flex items-center justify-between border bg-gray-100 px-2 fixed top-0 left-0 z-50 h-16">
            <div>
                <nav>
                    <Link to="/">
                        <img className="h-20 w-20" src="\src\assets\Pictures\FimLogga.png"></img>
                    </Link>
                </nav>
            </div>
            <div className="flex flex-row gap-4">
                <SseStream />
                {user &&
                    <Button className="bg-transparent border border-gray-300 text-gray-700" onClick={handleSignOut}>Sign out</Button>
                }
                {
                    !user &&
                    <Button className="bg-blue-500 text-white" onClick={handleSignOut}>Sign in</Button>
                }
            </div>
        </div>
        
    )
}
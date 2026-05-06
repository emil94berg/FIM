import { Link } from "react-router-dom"
import { signOut } from "../auth/authService";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"
import { useAuth } from '@/auth/useAuth';

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
                <nav>
                    <Link to="/">
                        <img className="h-20 w-20" src="\src\assets\Pictures\FimLogga.png"></img>
                    </Link>
                </nav>
                {user &&
                    <Button className="bg-transparent border border-gray-300 text-gray-700" onClick={handleSignOut}>Sign out</Button>
                }
                {
                    !user &&
                    <Button className="bg-blue-500 text-white" onClick={handleSignOut}>Sign in</Button>
                }
            </div>
        
    )
}
import { Link } from "react-router-dom"
import { signOut } from "../auth/authService";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"






export default function AppHeader() {
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate("/login");
    }

    return (
        <div style={{ display: "flex", width: "100%", position: "fixed" }}>
            <div className="w-full flex items-center justify-between border bg-gray-100 px-2 fixed top-0 left-0 z-50 h-16">
                <nav>
                    <Link to="/">
                        <img className="h-20 w-20" src="\src\assets\Pictures\FimLogga.png"></img>
                    </Link>
                </nav>
                <Button className="bg-red-500 text-white" onClick={handleSignOut}>Sign out</Button>
            </div>
        </div>
        
    )
}
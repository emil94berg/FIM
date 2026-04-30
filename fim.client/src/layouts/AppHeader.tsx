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
        <div className="flex items-center justify-between border bg-gray-100 px-4 py-2 ">
            <nav>
                <Link to="/">
                    <img className="h-20 w-20" src="\src\assets\Pictures\FimLogga.png"></img>
                </Link>
            </nav>

            <Button className="bg-red-500 absoulte bottom-0 right-0" onClick={handleSignOut}>Sign out</Button>




        </div>
    )
}
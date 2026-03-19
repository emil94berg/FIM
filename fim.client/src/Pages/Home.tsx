import { Button } from "@/Components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { signOut } from "../auth/authService";

export default function Home() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate("/login");
    };

    return (
        <div>
            <h1>Home</h1>
            <p>Welcome to the home page!</p>
            {!user ? (
                <div>
                    <Button className="bg-blue-500 text-black" onClick={() => navigate("/login")}>Go to Login</Button>
                </div>
            ) : (
                <div>
                    <p>Logged in as: {user.email}!</p>
                        <Button className="bg-blue-500 text-black" onClick={handleSignOut}>Sign Out</Button>
                </div>
            )}
        </div>
    )
} 
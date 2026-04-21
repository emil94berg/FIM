import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { signOut } from "../auth/authService";
import { NotificationList } from "@/components/notifications/NotificationList";
import Dashboard from "./Dashboard";
import { ChangeUserName } from "@/components/supabase/ChangeUserName";


export default function Home() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate("/login");
    };

    return (
        <div>
            {!user ? (
                <div>
                    <h1>Home</h1>
                    <p>Welcome to the home page!</p>
                    <Button className="bg-blue-500 text-black" onClick={() => navigate("/login")}>Go to Login</Button>
                </div>
            ) : (
                <div className="w-full h-screen flex flex-col">
                    <Dashboard />
                    <Button className="bg-blue-500 text-black" onClick={handleSignOut}>Sign Out</Button>
                    <ChangeUserName />
                </div>
            )}
        </div>
    )
} 
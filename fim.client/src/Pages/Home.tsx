import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { signOut } from "../auth/authService";
import { NotificationList } from "@/Components/notifications/NotificationList";

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
                    <button onClick={() => navigate("/login")}>Go to Login</button>
                </div>
            ) : (
                <div>
                    <p>Logged in as: {user.email}!</p>
                    <button onClick={handleSignOut}>Sign Out</button>
                    <NotificationList />
                </div>

            )}
        </div>
    )
} 
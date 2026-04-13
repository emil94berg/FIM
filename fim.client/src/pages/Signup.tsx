import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../auth/authService";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [success, setSuccess] = useState(false);

    const handleSignUp = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { error } = await signUp(email, password);
        if (error) {
            setError(error.message);
        } else {
            setSuccess(true);
        }
    };

    return (
        <div>
            <h1>SignUp</h1>
            {error && <p>{error}</p>}
            {success && (
                <div>
                    <p>Sign up successful! Please check your email to confirm your account.</p>
                    <button onClick={() => navigate("/login")}>Go to Login</button>
                </div>
            )}
            {!success && (
                <form onSubmit={handleSignUp}>
                    <div>
                        <label>Email:</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit">Sign Up</button>
                </form>
            )}
        </div>
    )
}
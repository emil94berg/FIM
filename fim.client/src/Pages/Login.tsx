import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "../auth/authService";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignIn = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { error } = await signIn(email, password);
        if (error) {
            setError(error.message);
        } else {
            navigate("/");
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <p>Not a signed up user? Click <a href="/signup">here</a> to sign up.</p>
            {error && <p>{error}</p>}
            <form onSubmit={handleSignIn}>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Sign In</button>
            </form>
        </div>
    )
}
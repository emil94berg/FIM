import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { signUp } from "../auth/authService"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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
        <div className="bg-blue-100 flex flex-col content-center items-center">
            <h1 className="m-10">SignUp</h1>
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
                        <Label>Email:</Label>
                        <Input style={{ marginTop: "4px" }} type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div>
                        <Label>Password:</Label>
                        <Input style={{ marginTop: "4px" }} type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                    <Button className="bg-blue-300 border mb-4" type="submit">Sign Up</Button>
                </form>
            )}
        </div>
    )
}
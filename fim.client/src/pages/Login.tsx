import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "../auth/authService";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button} from "@/components/ui/button"

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
        <div className="bg-blue-100 flex flex-col content-center items-center">
            <h1 className="m-10" >Login</h1>
            <p className="m-4">Not a signed up user? Click <a href="/signup">here</a> to sign up.</p>
            {error && <p>{error}</p>}
            <form onSubmit={handleSignIn}>
                <div>
                    <Label >Email:</Label>
                    <Input style={{  marginTop:"4px" }} type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div>
                    <Label>Password:</Label>
                    <Input style={{ marginTop: "4px" }} type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <Button className="bg-blue-300 border mb-4" type="submit">Sign In</Button>
            </form>
        </div>
    )
}
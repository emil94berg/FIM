import { Button } from "@/Components/ui/button"
import { useState } from "react";

export default function SideBar() {
    const [open, setOpen] = useState(false);
    return (
        <div style={{ maxWidth: "200px", height: "100%" }}>
            <Button className="bg-blue-500" onClick={() => setOpen(!open)}>☰</Button>
            {open && (
                <nav style={{ border: "1px solid black", margin: "5px", padding: "5px", backgroundColor: "beige" }}>
                    <ul>
                        <li>Home</li>
                        <li>About</li>
                        <li>Contact</li>
                    </ul>
                </nav>
            )}
        </div>
    );
}
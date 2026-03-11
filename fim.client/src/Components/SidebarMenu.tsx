import { useState } from "react";

export default function SideBar() {
    const [open, setOpen] = useState(false);
    return (
        <div style={{ maxWidth: "200px", height: "100%" }}>
            <button onClick={() => setOpen(!open)}>☰</button>
            {open && (
                <nav>
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
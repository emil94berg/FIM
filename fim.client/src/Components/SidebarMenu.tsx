import { Button } from "@/Components/ui/button"
import { Link } from "react-router-dom"
import { useState } from "react";

const components: { title: string; href: string; }[] = [
    {
        title: "Home",
        href: "/"
    },
    {
        title: "Create Print",
        href: "/create-print"
    },
    {
        title: "Create Spool",
        href: "/create-spool"
    },
]






export default function SideBar() {
    const [open, setOpen] = useState(true);
    return (
        //<div style={{ maxWidth: "200px", height: "100%" }}>
        //    <Button className="bg-blue-500" onClick={() => setOpen(!open)}>☰</Button>
        //    {open && (
        //        <nav style={{ border: "1px solid black", margin: "5px", padding: "5px", backgroundColor: "beige" }}>
        //            <ul>
        //                <li>Home</li>
        //                <li>About</li>
        //                <li>Contact</li>
        //            </ul>
        //        </nav>
        //    )}
        //</div>
        <div className="flex">
            <div className={`flex flex-col bg-gray-100 h-screen transition-all duration-300 ${open ? "w-48" : "w-12"}`}>
                <Button className="m-2 p-2 bg-blue-500 text-white" onClick={() => setOpen(!open)}>☰</Button>
                <nav className="flex flex-col mt-4 gap-2">
                    {components.map(c => (
                        <Link key={c.title}
                            to={c.href}
                            className={`block px-4 py-2 text-sm font-medium rounded hover:bg-gray-200 transition ${
                                !open ? "text-center" : ""
                            }` }               
                        >{open ? c.title : c.title[0]}</Link>
                    ))}
                </nav>
            </div>
        </div>

    );
}
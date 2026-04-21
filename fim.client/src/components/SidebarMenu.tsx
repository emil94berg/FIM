import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useState } from "react";
import { HomeIcon } from "@/components/icons/mynaui-home"
import { AddQueueIcon } from "@/components/icons/mynaui-add-queue"
import { ActivitySquareIcon } from "@/components/icons/mynaui-activity-square"
import { SquareDashedKanbanIcon } from "@/components/icons/mynaui-square-dashed-kanban"

const components: { title: string; href: string; icon?: React.ReactNode }[] = [
    {
        title: "Home",
        href: "/",
        icon: <HomeIcon className="w-5 h-5" ></HomeIcon>
    },
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: <SquareDashedKanbanIcon className="w-5 h-5" ></SquareDashedKanbanIcon>
    },
    {
        title: "Create Print",
        href: "/create-print",
        icon: <AddQueueIcon className="w-5 h-5" ></AddQueueIcon>
    },
    {
        title: "Create Spool",
        href: "/create-spool",
        icon: <AddQueueIcon className="w-5 h-5" ></AddQueueIcon>
    },
    {
        title: "Active Prints",
        href: "/ACtivePrints",
        icon: <ActivitySquareIcon className="w-5 h-5" ></ActivitySquareIcon>
    },
    {
        title: "Profile Page",
        href: "/profile",
        icon: <HomeIcon className="w-5 h-5" ></HomeIcon>
    }
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
                        <Link title={c.title} key={c.title}
                            to={c.href}
                            className={`block px-4 py-2 text-sm font-medium rounded hover:bg-gray-200 transition ${
                                !open ? "text-center" : ""
                            }` }               
                        >{open ? <span className="flex flex-row">{c.icon} {c.title}</span> : c.icon}</Link>
                    ))}
                </nav>
            </div>
        </div>

    );
}
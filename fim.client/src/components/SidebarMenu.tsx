import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { HomeIcon } from "@/components/icons/mynaui-home"
import { AddQueueIcon } from "@/components/icons/mynaui-add-queue"
import { ActivitySquareIcon } from "@/components/icons/mynaui-activity-square"
import { SquareDashedKanbanIcon } from "@/components/icons/mynaui-square-dashed-kanban"
import { BookIcon } from "@/components/icons/mynaui-book"
import { SmileSquareIcon } from "@/components/icons/mynaui-smile-square"
import { useAuth } from "@/auth/useAuth"

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
        title: "Forum",
        href: "/forum",
        icon: <BookIcon className="w-5 h-5" ></BookIcon>
    },
    {
        title: "Profile Page",
        href: "/profile",
        icon: <SmileSquareIcon className="w-5 h-5" ></SmileSquareIcon>
    }
]


export default function SideBar({open, setOpen} : {open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>}) {
    const { user } = useAuth();
    const avatarUrl = user
        ? `https://zjsclbapwgnhrslrmark.supabase.co/storage/v1/object/public/ProfilesImages/${user.id}/profilepictures/avatar`
        : null;

    return (
        <div className="flex">
            <div className={`fixed top-16 left-0 flex flex-col bg-gray-100 h-[calc(100vh-4rem)] transition-all duration-300 z-40 border-r border-gray-200 ${open ? "w-48" : "w-12"}`}>

                {/* Sidebar header */}
                <div className={`flex items-center px-2 py-3 border-b border-gray-200 shrink-0 ${open ? "justify-between" : "justify-center"}`}>
                    {open && (
                        <span className="text-sm font-semibold text-gray-700 truncate px-1">Navigation</span>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 bg-blue-500 text-white hover:bg-blue-600"
                        onClick={() => setOpen(!open)}
                        title={open ? "Collapse sidebar" : "Expand sidebar"}
                    >
                        ☰
                    </Button>
                </div>

                {/* Nav */}
                <nav className="flex flex-col flex-1 mt-2 gap-1 overflow-y-auto">
                    {components.map(c => (
                        <Link title={c.title} key={c.title}
                            to={c.href}
                            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded mx-1 hover:bg-gray-200 transition ${
                                !open ? "justify-center" : ""
                            }`}
                        >
                            <span className="shrink-0">{c.icon}</span>
                            {open && <span className="truncate">{c.title}</span>}
                        </Link>
                    ))}
                </nav>

                {/* Footer */}
                <div className={`border-t border-gray-200 p-2 shrink-0 ${open ? "" : "flex justify-center"}`}>
                    {open ? (
                        <div className="flex items-center gap-2 px-1">
                            {avatarUrl && (
                                <img src={avatarUrl} alt="User avatar" className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-300 shrink-0" />
                            )}
                            <p className="text-xs text-gray-500 truncate" title={user?.user_metadata.username ?? ""}>
                                {user?.user_metadata.username ?? "Unknown User"}
                            </p>
                        </div>
                    ) : (
                        avatarUrl && (
                            <img src={avatarUrl} alt="User avatar" className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-300" />
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
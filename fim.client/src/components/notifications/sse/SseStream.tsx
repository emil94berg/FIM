import { useEffect, useState } from "react"
import { getToken } from "@/auth/authService"
import type { components } from "@/types/schema"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { authFetch } from "@/auth/authFetch"
import { Bell } from "lucide-react"



type Notification = components["schemas"]["NotificationDto"];

export default function SseStream() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);

   
    useEffect(() => {
        const connect = async () => {
            const token = await getToken();
            const response = await fetch(`${apiUrl}/SSE/stream`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "text/event-stream"
                }
            });

            const reader = response.body?.getReader();

            if (!reader) return;

            const decoder = new TextDecoder();

            while (true) {
                const data = await reader.read();

                if (data.done) break;

                    const chunk = decoder.decode(data.value);

                    const notificationStrings = chunk.split("\n");

                for (let note of notificationStrings) {
                    if (note.startsWith("data: ")) {
                        note = note.replace("data: ", "");
                        try {
                            const parsed = JSON.parse(note);

                            const notification: Notification = {
                                id: parsed.Id,
                                message: parsed.Message,
                                type: parsed.Type,
                                isRead: parsed.IsRead,
                                createdAt: parsed.CreatedAt
                            }

                            setNotifications(prev => {
                                const exists = prev.some(p => p.id === notification.id);

                                if (exists) return prev;
                                notification.message = notification.message.charAt(0).toUpperCase() + notification.message.slice(1);
                                
                                return [...prev, notification]
                            });
                            
                        }
                        catch (error) {
                            console.log("JSON parse error...", error);
                        }
                        
                    }
                }
            }
        };
        connect();
    }, [apiUrl]);

    const handleNotificationsRead = async () => {
        try {
            const data: Notification[] = await authFetch(`${apiUrl}/Notification/Mark-as-read`, {
                method: "PUT",
                body: JSON.stringify(notifications.map(n => n.id))
            });
            if(data != null && data.length > 0) {
                setNotifications(data);
            }
        }
        catch (error) {
            console.log("Error marking notifications as read...", error);
        }
    }

    const notificationsNotReadCount = () => {
        const numberOfUnreadNotifications = notifications.filter(n => n.isRead === false).length;
        return numberOfUnreadNotifications;
    }

    const formatNotificationDate = (createdAt: string | null | undefined) => {
        if (!createdAt) return "Unknown time";

        const parsedDate = new Date(createdAt);
        if (Number.isNaN(parsedDate.getTime())) return "Unknown time";

        return parsedDate.toLocaleString("sv-SE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    const unreadCount = notificationsNotReadCount();
    const notificationsSortedByLatest = [...notifications].sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
    });

    // Redo with a popover instead of collapsible
    return (
        <div>
            <Collapsible
                open={isOpen}
                onOpenChange={(open) => {
                    setIsOpen(open);
                    if (open) {
                        void handleNotificationsRead();
                    }
                }}
                className="relative"
            >
                <div className="flex flex-col items-start gap-2">
                    <CollapsibleTrigger className="relative inline-flex items-center justify-center rounded-md border border-slate-300 bg-white p-2 transition-colors hover:bg-slate-100">
                        <Bell className={unreadCount > 0 ? "h-6 w-6 text-blue-500" : "h-6 w-6 text-slate-600"} />
                        {unreadCount > 0 ? (
                            <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-500 px-1 text-xs font-semibold text-white">
                                {unreadCount > 99 ? "99+" : unreadCount}
                            </span>
                        ) : null}
                    </CollapsibleTrigger>

                    <CollapsibleContent className="absolute top-14 right-0 z-50 flex flex-col gap-2 w-64 rounded-md
                                                    border border-slate-200 bg-white p-2 shadow-lg data-[state=closed]:hidden
                                                    overflow-y-scroll max-h-64">
                        {notifications.length === 0 ? (
                            <p className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-500">No notifications yet.</p>
                        ) : (
                            notificationsSortedByLatest.map(notification => (
                                <div
                                    key={notification.id}
                                    className="rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 overflow-x-clip"
                                >
                                    <p>{notification.message}</p>
                                    <p className="mt-1 text-xs text-slate-500">
                                        {formatNotificationDate(notification.createdAt)}
                                    </p>
                                </div>
                            ))
                        )}
                    </CollapsibleContent>
                </div>
            </Collapsible>            
        </div>
    )
    
}
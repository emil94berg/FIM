import { useEffect, useState } from "react"
import { getToken } from "@/auth/authService"
import type { components } from "@/types/schema"
import {
    Avatar,
    AvatarBadge,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import logo from "@/assets/Pictures/FimLogga.png"
import { authFetch } from "@/auth/authFetch";


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

                const chunk = decoder.decode(data.value);

                const notificationStrings = chunk.split("\n");

                for (let note of notificationStrings) {
                    if (note.startsWith("data: ")) {
                        note = note.replace("data: ", "");
                        console.log(note);
                        try {
                            const notification: Notification = JSON.parse(note.toLowerCase());

                            console.log(notification);

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
        const numberOfUnreadNotifications = notifications.filter(n => n.isRead == false).length;
        return numberOfUnreadNotifications;
    }
    

    return (
        <div>
            <Collapsible
                open={isOpen}
                onOpenChange={() => setIsOpen(prev => !prev)}
                className="relative"
                onClick={handleNotificationsRead}
            >
                <div className="flex flex-col items-start gap-2">
                    <CollapsibleTrigger className="bg-transparent border border-black">
                        <Avatar>
                            <AvatarImage
                                src={logo}
                                alt="notification"
                                className={notificationsNotReadCount() === 0 ? "grayscale" : ""}

                            ></AvatarImage>
                            <AvatarFallback>NF</AvatarFallback>
                            <AvatarBadge className={notificationsNotReadCount() === 0
                                ? "bg-grey-200"
                                : "bg-red-500 text-white text-xs"}>
                                {notificationsNotReadCount() === 0 ? "" : notificationsNotReadCount()}
                            </AvatarBadge>
                        </Avatar>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="absolute top-14 right-0 z-50 flex flex-col gap-2 w-64 rounded-md
                                                    border bg-gray-100 p-2 shadow-lg data-[state=closed]:hidden
                                                    overflow-y-scroll max-h-64">
                        {notifications.map(notification => (
                            <div
                                key={notification.id}
                                className="rounded-md border px-4 py-2 text-sm bg-blue-100"
                            >
                                <p>{notification.message}</p>
                            </div>
                        ))}
                    </CollapsibleContent>
                </div>
                
            </Collapsible>            
        </div>
    )
    
}
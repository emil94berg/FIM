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

                const { done, value } = await reader.read();

                if (done) break;

                const chunk = decoder.decode(value);

                if (chunk.startsWith("data: ")) {

                    const json = chunk.replace("data: ", "").toLowerCase();

                    const notification: Notification = JSON.parse(json);

                    console.log(notification.message);

                    setNotifications(prev => [...prev, notification]);
                }
            }
        };
        connect();
    }, [apiUrl]);

    return (
        <div>
            <Collapsible
                open={isOpen}
                onOpenChange={() => setIsOpen(prev => !prev)}
                className="relative"
            >
                <div className="flex flex-col items-start gap-2">
                    <CollapsibleTrigger className="bg-transparent border border-black">
                        <Avatar>
                            <AvatarImage
                                src={logo}
                                alt="notification"
                                className={notifications.length === 0 ? "grayscale" : ""}

                            ></AvatarImage>
                            <AvatarFallback>NF</AvatarFallback>
                            <AvatarBadge className={notifications.length === 0
                                ? "bg-grey-200"
                                : "bg-red-500 text-white text-xs"}>
                                {notifications.length === 0 ? "" : notifications.length}
                            </AvatarBadge>
                        </Avatar>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="absolute top-14 right-0 z-50 flex flex-col gap-2 w-64 rounded-md
                                                    border bg-white p-2 shadow-lg data-[state=closed]:hidden
                                                    overflow-y-scroll max-h-64">
                        {notifications.map(notification => (
                            <div
                                key={notification.id}
                                className="rounded-md border px-4 py-2 text-sm bg-white"
                            >
                                <p>{notification.message.toString()}</p>
                            </div>
                        ))}
                    </CollapsibleContent>
                </div>
                
            </Collapsible>





            

            
        </div>
    )
    
}
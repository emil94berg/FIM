import { useEffect, useState } from "react"
import { getToken } from "@/auth/authService"


export default function SseStream() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const [notification, setNotification] = useState<string[]>([]);

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
                setNotification(prev => [...prev, chunk]);
                console.log(chunk);
            }
        };
        
        connect();
    },[]);

    return (
        <div>
            {notification.length}
        </div>
    )
    
}
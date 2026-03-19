import { useEffect, useState } from "react";
import { authFetch } from "../auth/authFetch";

type Notification = {
  id: number;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await authFetch("https://localhost:7035/notification");
        setNotifications(data ?? []);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 15000); // Poll every 15 seconds

    return () => clearInterval(interval);
  }, []);

  return notifications;
};
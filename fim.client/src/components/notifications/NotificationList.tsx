import { useNotifications } from "../../services/useNotifications";

export const NotificationList = () => {
    const notifications = useNotifications();

    return (
        <div>
            <h2>Notifications</h2>
            <ul>
                {notifications.map((notification) => (
                    <li key={notification.id}>
                        <p>{notification.message}</p>
                        <small>{new Date(notification.createdAt).toLocaleString()}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
}
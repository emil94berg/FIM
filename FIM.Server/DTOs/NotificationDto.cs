using FIM.Server.Models;

namespace FIM.Server.DTOs;

public record NotificationDto(
    int Id,
    string Message,
    string Type,
    bool IsRead,
    DateTime CreatedAt
);

public static class NotificationExtensions
{
    public static NotificationDto ToNotificationDto(this Notification notification)
    {
        return new(
            notification.Id,
            notification.Message,
            notification.Type,
            notification.IsRead,
            notification.CreatedAt
            );
    }
    public static List<NotificationDto> ToNotificationDtoList(this List<Notification> notifications)
    {
        return notifications.Select(n => n.ToNotificationDto()).ToList();
    }
}
    
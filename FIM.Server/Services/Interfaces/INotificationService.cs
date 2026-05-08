using FIM.Server.DTOs;

namespace FIM.Server.Services.Interfaces
{
    public interface INotificationService
    {
        Task<List<NotificationDto>> GetNotificationsForUserAsync(string userId);
        Task<List<NotificationDto>> GetLatestNotificationsAsync(string userId, int numberOfNotificationsToTake);
        Task<List<NotificationDto>> MarkNotificationsAsReadAsync(List<int> notificationsIds);
    }
}
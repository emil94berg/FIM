using FIM.Server.Data;
using FIM.Server.DTOs;
using FIM.Server.Migrations;
using FIM.Server.Models;
using FIM.Server.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FIM.Server.Services
{
    public class NotificationService : INotificationService
    {
        private readonly ApplicationDbContext _dbContext;

        public NotificationService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<NotificationDto>> GetNotificationsForUserAsync(string userId)
        {
            return await _dbContext.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .Select(n => new NotificationDto(n.Id, n.Message, n.Type, n.IsRead, n.CreatedAt))
                .ToListAsync();
        }
        public async Task<List<NotificationDto>> GetLatestNotificationsAsync(string userId, int numberOfNotificationsToTake)
        {
            return await _dbContext.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .Take(numberOfNotificationsToTake)
                .Select(n => new NotificationDto(n.Id, n.Message, n.Type, n.IsRead, n.CreatedAt))
                .ToListAsync();
        }
        public async Task<List<NotificationDto>> MarkNotificationsAsReadAsync(List<int> notificationsIds)
        {
            var result = await _dbContext.Notifications.Where(n => notificationsIds.Contains(n.Id)).ToListAsync();
            foreach(var n in result)
            {
                n.IsRead = true;
            }
            _dbContext.UpdateRange(result);
            await _dbContext.SaveChangesAsync();
            return result.ToNotificationDtoList();
        }
    }
}
using FIM.Server.Models;
using FIM.Server.Data;
using FIM.Server.DTOs;
using Microsoft.EntityFrameworkCore;
using FIM.Server.Services.Interfaces;

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
    }
}
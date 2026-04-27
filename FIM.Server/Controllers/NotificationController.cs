using FIM.Server.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FIM.Server.Services.Interfaces;

namespace FIM.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class NotificationController : ControllerBase
    {
        private string UserId => User.FindFirst("sub")!.Value;
        private readonly INotificationService _notificationService;

        public NotificationController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        
        [HttpGet(Name = "GetNotifications")]
        public async Task<ActionResult<List<NotificationDto>>> GetNotifications()
        {
            var notifications = await _notificationService.GetNotificationsForUserAsync(UserId);
            return Ok(notifications);
        }
    }
}
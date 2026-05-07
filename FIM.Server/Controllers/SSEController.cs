using FIM.Server.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace FIM.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class SSEController : ControllerBase
    {
        private readonly INotificationService _notificationService;
        public SSEController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }
        private string UserId => User.FindFirst("sub")!.Value;

        [HttpGet("stream")]
        public async Task GetNotification()
        {
            var sentNotificationIds = new HashSet<int>();

            Response.ContentType = "text/event-stream";

            while (!HttpContext.RequestAborted.IsCancellationRequested)
            {
                var notifications = await _notificationService.GetLatestNotificationsAsync(UserId, 10);

                var newNotifications = notifications.Where(n => !sentNotificationIds.Contains(n.Id)).ToList();

                if(newNotifications.Any())
                {
                    string jsonString = "";

                    foreach (var notification in newNotifications)
                    {
                        sentNotificationIds.Add(notification.Id);

                        var json = JsonSerializer.Serialize(notification);

                        var jsonAdd = $"data: {json}\n\n";

                        jsonString += jsonAdd;
                    }
                    await Response.WriteAsync(jsonString);

                }
                await Response.Body.FlushAsync();
                await Task.Delay(10000);
            }
        }
    }
}

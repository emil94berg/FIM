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
            var notificationList = await _notificationService.GetNotificationsForUserAsync(UserId);

            Response.ContentType = "text/event-stream";

            string jsonString = "";

            foreach (var notification in notificationList)
            {
                var json = JsonSerializer.Serialize(notification);

                var jsonAdd = $"data: {json}\n\n";

                jsonString += jsonAdd;
            }

            await Response.WriteAsync(jsonString);
            await Response.Body.FlushAsync();
        }
    }
}

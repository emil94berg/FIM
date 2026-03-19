using FIM.Server.Data;
using FIM.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FIM.Server.Controllers
{
    [ApiController]
    [Authorize]
    [Route("[controller]")]
    public class NotificationController : ControllerBase
    {
        private string UserId => User.FindFirst("sub")!.Value;
        private readonly ApplicationDbContext _dbContext;

        public NotificationController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        
        [HttpGet(Name = "GetNotifications")]
        public async Task<ActionResult<List<Notification>>> GetNotifications()
        {
            var notifications = await _dbContext.Notifications
                .Where(n => n.UserId == UserId)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();

            return Ok(notifications);
        }
    }
}
using Microsoft.AspNetCore.Mvc;
using FIM.Server.Models;

namespace FIM.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SpoolController : ControllerBase
    {
        [HttpGet(Name = "GetSpools")]
        public IEnumerable<Spool> Get()
        {
            // This is just a placeholder. You would typically fetch this data from a database.
            return new List<Spool>
            {
                new Spool { Id = 1, UserId = "user1", Material = "PLA", Color = "Red", TotalWeight = 1000, RemainingWeight = 800, SpoolCost = 29.99m },
                new Spool { Id = 2, UserId = "user2", Material = "ABS", Color = "Blue", TotalWeight = 500, RemainingWeight = 250, SpoolCost = 39.99m }
            }
            .ToArray();
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using FIM.Server.Models;

namespace FIM.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PrintController : ControllerBase
    {
        [HttpGet(Name = "GetPrints")]
        public IEnumerable<Print> Get()
        {
            // This is just a placeholder. You would typically fetch this data from a database.
            return new List<Print>
            {
                new Print { Id = 1, Name = "Test Print 1", SpoolId = 1, GramsUsed = 50, Status = Models.PrintStatus.Completed },
                new Print { Id = 2, Name = "Test Print 2", SpoolId = 2, GramsUsed = 100, Status = Models.PrintStatus.Printing }
            }
            .ToArray();
        }
    }
}

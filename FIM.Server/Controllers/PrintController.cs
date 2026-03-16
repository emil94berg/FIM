using Microsoft.AspNetCore.Mvc;
using FIM.Server.Models;
using FIM.Server.Data;
using Microsoft.EntityFrameworkCore;

namespace FIM.Server.Controllers
{
    
    [ApiController]
    [Route("[controller]")]
    public class PrintController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PrintController(ApplicationDbContext dbContext)
        {
            _context = dbContext;
        }

        [HttpGet(Name = "GetPrints")]
        public async Task<IEnumerable<Print>> Get()
        {
            //return await _context.Prints.ToListAsync();
            return await _context.Prints.Include(p => p.Spool).ToListAsync();
        }

        [HttpPost]
        public async Task<IActionResult> CreateChat([FromBody] Models.Print print)
        {
            await _context.Prints.AddAsync(print);
            await _context.SaveChangesAsync();

            return Ok(print);
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using FIM.Server.Models;
using Microsoft.EntityFrameworkCore;
using FIM.Server.Data;

namespace FIM.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SpoolController(ApplicationDbContext dbContext) : ControllerBase
    {
        [HttpGet(Name = "GetAllSpools")]
        public async Task<ActionResult<IEnumerable<Spool>>> GetAllSpools()
        {
            var spools = await dbContext.Spools.ToListAsync();
            return spools;
        }

        [HttpGet("{id}", Name = "GetSpoolById")]
        public async Task<ActionResult<Spool>> GetSpoolById(int id)
        {
            var spool = await dbContext.Spools.FindAsync(id);
            if (spool == null)
            {
                return NotFound();
            }
            return spool;
        }

        [HttpPost(Name = "CreateSpool")]
        public async Task<ActionResult<Spool>> CreateSpool(Spool spool)
        {
            dbContext.Spools.Add(spool);
            await dbContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetSpoolById), new { id = spool.Id }, spool);
        }
    }
}

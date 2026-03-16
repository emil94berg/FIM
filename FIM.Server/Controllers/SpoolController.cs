using Microsoft.AspNetCore.Mvc;
using FIM.Server.Models;
using FIM.Server.DTOs;
using FIM.Server.Services.Interfaces;

namespace FIM.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SpoolController(ISpoolService spoolService) : ControllerBase
    {
        [HttpGet(Name = "GetAllSpools")]
        public async Task<ActionResult<IEnumerable<SpoolDto>>> GetAllSpools()
        {
            var spools = await spoolService.GetAllSpoolsAsync();
            return Ok(spools);
        }

        [HttpGet("{id}", Name = "GetSpoolById")]
        public async Task<ActionResult<SpoolDto>> GetSpoolById(int id)
        {
            var spool = await spoolService.GetSpoolByIdAsync(id);
            if (spool == null)
            {
                return NotFound();
            }
            return Ok(spool);
        }

        [HttpPost(Name = "CreateSpool")]
        public async Task<ActionResult<SpoolDto>> CreateSpool(Spool spool)
        {
            var created = await spoolService.CreateSpoolAsync(spool);
            return CreatedAtAction(nameof(GetSpoolById), new { id = created.Id }, created);
        }
    }
}

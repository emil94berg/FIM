using Microsoft.AspNetCore.Mvc;
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
        public async Task<ActionResult<SpoolDto>> CreateSpool(CreateSpoolDto dto)
        {
            var created = await spoolService.CreateSpoolAsync(dto);
            return CreatedAtAction(nameof(GetSpoolById), new { id = created.Id }, created);
        }

        [HttpDelete("{id}", Name = "DeleteSpool")]
        public async Task<IActionResult> DeleteSpool(int id)
        {
            var deleted = await spoolService.DeleteSpoolAsync(id);
            if (!deleted)
            {
                return NotFound();
            }
            return Ok();
        }
        [HttpPatch("{id}", Name = "UpdateSpool")]
        public async Task<ActionResult<SpoolDto>> UpdateSpool(int id, UpdateSpoolDto dto)
        {
            try
            {
                var updated = await spoolService.UpdateSpoolAsync(id, dto);
                if (updated == null)
                {
                    return NotFound();
                }
                return Ok(updated);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}

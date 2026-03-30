using FIM.Server.DTOs.Filament;
using FIM.Server.DTOs.SpoolDtos;
using FIM.Server.Migrations;
using FIM.Server.Models;
using FIM.Server.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static FIM.Server.DTOs.Filament.FilamentRecord;

namespace FIM.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class SpoolController(ISpoolService spoolService) : ControllerBase
    {
        private string UserId => User.FindFirst("sub")!.Value;

        [HttpGet(Name = "GetAllSpools")]
        public async Task<ActionResult<IEnumerable<SpoolDto>>> GetAllSpools()
        {
            var spools = await spoolService.GetAllSpoolsAsync(UserId);
            return Ok(spools);
        }

        [HttpGet("{id}", Name = "GetSpoolById")]
        public async Task<ActionResult<SpoolDto>> GetSpoolById(int id)
        {
            var spool = await spoolService.GetSpoolByIdAsync(id, UserId);
            if (spool == null)
            {
                return NotFound();
            }
            return Ok(spool);
        }

        [HttpPost(Name = "CreateSpool")]
        public async Task<ActionResult<SpoolDto>> CreateSpool(CreateSpoolDto dto)
        {
            var created = await spoolService.CreateSpoolAsync(dto, UserId);
            return CreatedAtAction(nameof(GetSpoolById), new { id = created.Id }, created);
        }

        [HttpDelete("{id}", Name = "DeleteSpool")]
        public async Task<IActionResult> DeleteSpool(int id)
        {
            var deleted = await spoolService.DeleteSpoolAsync(id, UserId);
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
                var updated = await spoolService.UpdateSpoolAsync(id, dto, UserId);
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
        [HttpGet("GetLowSpools")]
        public async Task<IActionResult> GetLowSpools()
        {
            var returnList = await spoolService.GetLowSpools(UserId);
            return Ok(returnList);
        }

        [HttpPost("FavoriteToSpool")]
        public async Task<IActionResult> FromCatalogToSpoolsAsync([FromBody] FavoriteToSpoolRequest requestDto)
        {
            var result = await spoolService.AddToSpoolFromFavorite(requestDto.FilamentDto, UserId, requestDto.Price);

            if (result) return Ok();
            else return NotFound();
        }
        [HttpPost("UpdateSpoolWeight")]
        public async Task<IActionResult> UpdateSpoolWeight([FromBody] SpoolWeightDto dto)
        {
            Console.WriteLine(dto.GramsUsed + " " + dto.SpoolId);
            return Ok();
            
        }

    }
}

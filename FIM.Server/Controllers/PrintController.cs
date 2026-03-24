using Microsoft.AspNetCore.Mvc;
using FIM.Server.Models;
using Microsoft.AspNetCore.Authorization;
using FIM.Server.Services.Interfaces;
using FIM.Server.DTOs.PrintDtos;

namespace FIM.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class PrintController : ControllerBase
    {
        private string UserId => User.FindFirst("sub")!.Value;

        private readonly IPrintService _printService;

        public PrintController(IPrintService printService)
        {
            _printService = printService;
        }

        [HttpGet(Name = "GetPrints")]
        public async Task<IEnumerable<PrintDto>> GetAllPrints()
        {
            return await _printService.GetAllPrintsAsync(UserId);
        }

        [HttpPost(Name = "CreatePrint")]
        public async Task<IActionResult> CreatePrintAsync([FromBody] CreatePrintDto createPrintDto)
        {
            var created = await _printService.CreatePrintAsync(createPrintDto, UserId);
            return Ok(created);
        }

        [HttpDelete("{id}", Name = "DeletePrint")]
        public async Task<IActionResult> DeletePrintAsync(int id)
        {
            var deleted = await _printService.DeletePrintAsync(id, UserId);
            if (!deleted) return NotFound();
            else return Ok();
        }

        [HttpPatch("{id}", Name = "UpdatePrint")]
        public async Task<IActionResult> UpdatePrintAsync(int id, [FromBody] UpdatePrintDto updatePrintDto)
        {
            var (update, warning) = await _printService.UpdatePrintAsync(id, updatePrintDto, UserId);
            if (warning != null)
                return BadRequest(new { message = warning });
            if (update == null)
                return NotFound();
            return Ok(update);
        }
        [HttpGet("pending")]
        public async Task<IActionResult> GetPendingPrints()
        {
            var list = await _printService.AllPendingPrintsAsync(UserId);
            if(list != null)
            {
                return Ok(list);
            }
            else
            {
                return BadRequest();
            }
        }
        [HttpGet("printing")]
        public async Task<IActionResult> GetPrintingPrints()
        {
            var list = await _printService.AllPrintingPrintsAsync(UserId);
            if(list != null)
            {
                return Ok(list);
            }
            else
            {
                return BadRequest();
            }
        }
    }
}

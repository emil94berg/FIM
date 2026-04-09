using Microsoft.AspNetCore.Mvc;
using FIM.Server.Models;
using Microsoft.AspNetCore.Authorization;
using FIM.Server.Services.Interfaces;
using FIM.Server.DTOs.PrintDtos;
using FIM.Server.Services;

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
            if (warning != null && update == null)
                return BadRequest(new { message = warning });
            if (update == null)
                return NotFound();
            if (warning != null)
                return Ok(new { print = update, warning });
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
        [HttpGet("GetActivePrints")]
        public async Task<IActionResult> GetActivePrintsAsync()
        {
            var data = await _printService.GetActivePrintsAsync(UserId);
            if (data != null) return Ok(data);
            else return BadRequest();
        }
        [HttpPost("CancelPrint")]
        public async Task<IActionResult> CancelPrintAsync([FromBody] PrintDto printDto)
        {
            var result = await _printService.CancelPrintAsync(UserId, printDto.Id);
            if(result != null) return Ok(result);
            else return BadRequest();
        }
        [HttpPost("StartPrint")]
        public async Task<IActionResult> StartPrintAsync([FromBody] StartPrintDto print)
        {
            if(print.estimatedTime <= 0) return BadRequest(new { message = "Estimated time must be greater than 0." });
            var result = await _printService.StartPrintAsync(print.id, UserId, print.estimatedTime);
            if(result != null) return Ok(result);
            else return BadRequest();
        }
        [HttpGet("GetAllDeletedPrints")]
        public async Task<IActionResult> GetAllDeletedPrintsAsync()
        {
            var result = await _printService.GetAllDeletedPrintsAsync(UserId);
            if(result != null && result.Count != 0) return Ok(result);  
            else return NotFound();
        }
        [HttpPost("UpdateStatus")]
        public async Task<IActionResult> UpdatePrintStatusAsync([FromBody] UpdatePrintStatusDto statusDto)
        {
            var result = await _printService.UpdatePrintStatusAsync(UserId, statusDto);
            if(result != null) return Ok(result);
            else return BadRequest();
        }
    }
}

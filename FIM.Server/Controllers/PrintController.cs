using Microsoft.AspNetCore.Mvc;
using FIM.Server.Models;
using FIM.Server.Data;
using Microsoft.EntityFrameworkCore;
using FIM.Server.Services.Interfaces;

namespace FIM.Server.Controllers
{
    
    [ApiController]
    [Route("[controller]")]
    public class PrintController : ControllerBase
    {
        private readonly IPrintService _printService;

        public PrintController(IPrintService printService)
        {
            _printService = printService;
        }

        [HttpGet(Name = "GetPrints")]
        public async Task<IEnumerable<Print>> Get()
        {
            return await _printService.GetAllPrintsAsync();
        }

        [HttpPost(Name = "CreatePrint")]
        public async Task<IActionResult> CreatePrintAsync([FromBody] Models.Print print)
        {
            var created = await _printService.CreatePrintAsync(print);
            return Ok(created);
        }

        [HttpDelete("{id}", Name = "DeletePrint")]
        public async Task<IActionResult> DeletePrintAsync(int id)
        {
            var deleted = await _printService.DeletePrintAsync(id);
            if (!deleted) return NotFound();
            else return NoContent();
        }

        [HttpPut("{id}", Name = "UpdatePrint")]
        public async Task<IActionResult> UpdatePrintAsync(int id, [FromBody] Print print)
        {
            var update = await _printService.UpdatePrintAsync(id, print);
            if (update == false)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}

using FIM.Server.DTOs.Filament;
using FIM.Server.Migrations;
using FIM.Server.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static FIM.Server.DTOs.Filament.FilamentRecord;

namespace FIM.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class PublicFilamentCatalogController : ControllerBase
    {
        private string UserId => User.FindFirst("sub")!.Value;
        private readonly IPublicFilamentCatalogService _publicFilamentService;

        public PublicFilamentCatalogController(IPublicFilamentCatalogService publicFilamentService)
        {
            _publicFilamentService = publicFilamentService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedFilamentResult>> GetWholeCatalog([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, [FromQuery] string sortOrder = "name", [FromQuery] string? searchTerm = null, [FromQuery] bool isDescending = false)
        {
            pageNumber = pageNumber < 1 ? 1 : pageNumber;
            pageSize = pageSize < 1 ? 10 : pageSize;

            var result = await _publicFilamentService.GetPaginatedFilamentCatalog(
                pageNumber, 
                pageSize, 
                sortOrder, 
                UserId, 
                searchTerm,
                isDescending);
            
            if (result == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(result);
            }
        }

    }
}

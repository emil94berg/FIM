using FIM.Server.DTOs.Filament;
using FIM.Server.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FIM.Server.Controllers
{
  
    [ApiController]
    [Route("[controller]")]
    public class PublicFilamentCatalogController : ControllerBase
    {
        //private string UserId => User.FindFirst("sub")!.Value;
        private readonly IPublicFilamentCatalogService _publicFilamentService;

        public PublicFilamentCatalogController(IPublicFilamentCatalogService publicFilamentService)
        {
            _publicFilamentService = publicFilamentService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FilamentRecord>>> GetWholeCatalog([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 20, [FromQuery] string sortOrder = "name")
        {
            pageNumber = pageNumber < 1 ? 1 : pageNumber;
            pageSize = pageSize < 1 ? 20 : pageSize;

            var publicFilamentCatalog = await _publicFilamentService.GetPaginatedFilamentCatalog(pageNumber, pageSize, sortOrder);
            var returnList = FilamentRecord.ToFilamentRecordList(publicFilamentCatalog);
            if (returnList == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(returnList);
            }
        }

    }
}

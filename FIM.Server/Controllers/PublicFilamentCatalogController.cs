using FIM.Server.DTOs.Filament;
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
        public async Task<ActionResult<IEnumerable<FilamentRecordDto>>> GetWholeCatalog()
        {
                var publicFilamentCatalog = await _publicFilamentService.GetWholeFilamentCatalog(UserId);
                if (publicFilamentCatalog == null)
                {
                    return NotFound();
                }
                else
                {
                    return Ok(publicFilamentCatalog);
                }
        }

    }
}

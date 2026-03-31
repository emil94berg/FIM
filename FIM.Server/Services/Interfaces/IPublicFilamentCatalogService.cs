using FIM.Server.Models;
using static FIM.Server.DTOs.Filament.FilamentRecord;

namespace FIM.Server.Services.Interfaces
{
    public interface IPublicFilamentCatalogService
    {
        Task<List<PublicFilamentCatalog>> GetPaginatedFilamentCatalog(int pageNumber, int pageSize, string sortOrder);
    }
}

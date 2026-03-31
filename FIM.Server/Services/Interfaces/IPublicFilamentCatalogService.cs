using FIM.Server.Models;
using static FIM.Server.DTOs.Filament.FilamentRecord;

namespace FIM.Server.Services.Interfaces
{
    public interface IPublicFilamentCatalogService
    {
        Task<List<FilamentRecordDto>> GetPaginatedFilamentCatalog(int pageNumber, int pageSize, string sortOrder, string userId);
    }
}

using FIM.Server.Models;
using FIM.Server.DTOs.Filament;

namespace FIM.Server.Services.Interfaces
{
    public interface IPublicFilamentCatalogService
    {
        Task<PagedFilamentResult> GetPaginatedFilamentCatalog(int pageNumber, int pageSize, string sortOrder, string userId, string? searchTerm, bool isDescending);
    }
}

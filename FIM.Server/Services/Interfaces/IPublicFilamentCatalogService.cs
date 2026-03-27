using FIM.Server.Models;

namespace FIM.Server.Services.Interfaces
{
    public interface IPublicFilamentCatalogService
    {
        Task<List<PublicFilamentCatalog>> GetPaginatedFilamentCatalog(int pageNumber, int pageSize, string sortOrder);
    }
}

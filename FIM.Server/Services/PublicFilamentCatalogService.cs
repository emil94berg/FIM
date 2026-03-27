using FIM.Server.Data;
using FIM.Server.Models;
using FIM.Server.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FIM.Server.Services
{
    public class PublicFilamentCatalogService : IPublicFilamentCatalogService
    {
        private readonly ApplicationDbContext _dbContext;
        public PublicFilamentCatalogService(ApplicationDbContext dbContext)
        {
             _dbContext = dbContext;
        }
        public async Task<List<PublicFilamentCatalog>> GetPaginatedFilamentCatalog(int pageNumber, int pageSize, string sortOrder)
        {
            // return await _dbContext.PublicFilamentCatalogs
            //     .OrderBy(f => f.Name)
            //     .Skip((pageNumber - 1) * pageSize)
            //     .Take(pageSize)
            //     .ToListAsync();

            var baseQuery = _dbContext.PublicFilamentCatalogs.AsNoTracking();

            var sortedQuery = sortOrder.ToLower() switch
            {
                "name" => baseQuery.OrderBy(f => f.Name).ThenBy(f => f.Id),
                "brand" => baseQuery.OrderBy(f => f.Brand).ThenBy(f => f.Id),
                "material" => baseQuery.OrderBy(f => f.Material).ThenBy(f => f.Id),
                "color" => baseQuery.OrderBy(f => f.ColorHex).ThenBy(f => f.Id),
                "hexcolor" => baseQuery.OrderBy(f => f.ColorHex).ThenBy(f => f.Id),
                "diameter" => baseQuery.OrderBy(f => f.Diameter).ThenBy(f => f.Id),
                _ => baseQuery.OrderBy(f => f.Id)
            };
            var result = await sortedQuery
                        .Skip((pageNumber - 1) * pageSize)
                        .Take(pageSize)
                        .ToListAsync();

            return result;
        }
    }
}

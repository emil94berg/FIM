using FIM.Server.Data;
using FIM.Server.Migrations;
using FIM.Server.Models;
using FIM.Server.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using static FIM.Server.DTOs.Filament.FilamentRecord;

namespace FIM.Server.Services
{
    public class PublicFilamentCatalogService : IPublicFilamentCatalogService
    {
        private readonly ApplicationDbContext _dbContext;
        public PublicFilamentCatalogService(ApplicationDbContext dbContext)
        {
             _dbContext = dbContext;
        }
        public async Task<List<FilamentRecordDto>> GetPaginatedFilamentCatalog(int pageNumber, int pageSize, string sortOrder, string userId)
        {
            // return await _dbContext.PublicFilamentCatalogs
            //     .OrderBy(f => f.Name)
            //     .Skip((pageNumber - 1) * pageSize)
            //     .Take(pageSize)
            //     .ToListAsync();

            // var baseQuery = _dbContext.PublicFilamentCatalogs.AsNoTracking();

            // var sortedQuery = sortOrder.ToLower() switch
            // {
            //     "name" => baseQuery.OrderBy(f => f.Name).ThenBy(f => f.Id),
            //     "brand" => baseQuery.OrderBy(f => f.Brand).ThenBy(f => f.Id),
            //     "material" => baseQuery.OrderBy(f => f.Material).ThenBy(f => f.Id),
            //     "color" => baseQuery.OrderBy(f => f.ColorHex).ThenBy(f => f.Id),
            //     "hexcolor" => baseQuery.OrderBy(f => f.ColorHex).ThenBy(f => f.Id),
            //     "diameter" => baseQuery.OrderBy(f => f.Diameter).ThenBy(f => f.Id),
            //     _ => baseQuery.OrderBy(f => f.Id)
            // };
            // var result = await sortedQuery
            //             .Skip((pageNumber - 1) * pageSize)
            //             .Take(pageSize)
            //             .ToListAsync();

            // return result;

            var skip = (pageNumber -1) * pageSize;

            // First we get Ids of records sorted
            var idQuery = ApplySorting(_dbContext.PublicFilamentCatalogs.AsNoTracking(), sortOrder);

            var pageIds = await idQuery
                .Select(f => f.Id)
                .Skip(skip)
                .Take(pageSize)
                .ToListAsync();

            if (!pageIds.Any()) return new List<FilamentRecordDto>();

            // Fetch the full records for those Ids
            var finalResult = await _dbContext.PublicFilamentCatalogs
                .AsNoTracking()
                .Where(f => pageIds.Contains(f.Id))
                .ToListAsync();

            // Re-sort the final 10 results
            var list = ApplySorting(finalResult.AsQueryable(), sortOrder).ToList();

            var returnList = new List<FilamentRecordDto>();

            foreach(var f in list)
            {
                bool favorite = _dbContext.UserFavoriteFilaments.Any(uf => uf.UserId == userId && uf.FilamentId == f.Id);
                var filamentCatalogDto = new FilamentRecordDto(
                    f.Identifier,
                    f.Brand,
                    f.Name,
                    f.Material,
                    f.Weight,
                    f.Diameter,
                    f.ColorHex,
                    f.ColorHexes,
                    f.ExtruderTemp, 
                    f.BedTemp,
                    f.Finish,
                    f.Translucent,
                    f.Glow,
                    favorite
                    );
                returnList.Add(filamentCatalogDto);
            }
            return returnList;
          
        }

        private IQueryable<PublicFilamentCatalog> ApplySorting(IQueryable<PublicFilamentCatalog> query, string sortOrder)
        {
            return sortOrder?.ToLower() switch
            {
                "name"     => query.OrderBy(f => f.Name).ThenBy(f => f.Id),
                "brand"    => query.OrderBy(f => f.Brand).ThenBy(f => f.Id),
                "material" => query.OrderBy(f => f.Material).ThenBy(f => f.Id),
                "color"    => query.OrderBy(f => f.ColorHex).ThenBy(f => f.Id),
                "diameter" => query.OrderBy(f => f.Diameter).ThenBy(f => f.Id),
                _          => query.OrderBy(f => f.Name).ThenBy(f => f.Id)
            };
        }
    }
}

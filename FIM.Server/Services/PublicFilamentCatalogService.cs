using FIM.Server.Data;
using FIM.Server.DTOs.Filament;
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
        public async Task<PagedFilamentResult> GetPaginatedFilamentCatalog(int pageNumber, int pageSize, string sortOrder, string userId, string? searchTerm, bool isDescending)
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
            var baseQuery = _dbContext.PublicFilamentCatalogs.AsNoTracking();

            if(!string.IsNullOrWhiteSpace(searchTerm))
            {
                var tokens = searchTerm.Split(' ', StringSplitOptions.RemoveEmptyEntries);

                foreach(var token in tokens)
                {
                    var lowerToken = token.ToLower();
                    baseQuery = baseQuery.Where(f => 
                        f.Name.ToLower().Contains(lowerToken) ||
                        f.Brand.ToLower().Contains(lowerToken) ||
                        f.Material.ToLower().Contains(lowerToken) ||
                        f.ColorHex.ToLower().Contains(lowerToken) ||
                        f.Diameter.ToString().Contains(lowerToken)
                    );
                }
            }

            var totalCount = await baseQuery.CountAsync();
            // First we get Ids of records sorted
            var idQuery = ApplySorting(baseQuery, sortOrder,isDescending);

            var pageIds = await idQuery
                .Select(f => f.Id)
                .Skip(skip)
                .Take(pageSize)
                .ToListAsync();

            if (!pageIds.Any())
            {
                return new PagedFilamentResult {
                    TotalCount = totalCount,
                    PageNumber = pageNumber,
                    PageSize = pageSize,
                    Items = new List<FilamentRecordDto>()
                };
            }

            // Fetch the full records for those Ids
            var finalResult = await _dbContext.PublicFilamentCatalogs
                .AsNoTracking()
                .Where(f => pageIds.Contains(f.Id))
                .ToListAsync();

            var userFavorites = await _dbContext.UserFavoriteFilaments
                .AsNoTracking()
                .Where(uf => uf.UserId == userId && pageIds.Contains(uf.FilamentId))
                .Select(uf => uf.FilamentId)
                .ToListAsync();

            // Re-sort the final 10 results
            var sortedList = ApplySorting(finalResult.AsQueryable(), sortOrder, isDescending).ToList();

            

            var items = sortedList.Select(f => new FilamentRecordDto(
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
                userFavorites.Contains(f.Id)
            )).ToList();

            return new PagedFilamentResult {
                Items = items,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        private IQueryable<PublicFilamentCatalog> ApplySorting(IQueryable<PublicFilamentCatalog> query, string sortOrder, bool isDescending)
        {
            return sortOrder?.ToLower() switch
            {
                "name"     => isDescending ? query.OrderByDescending(f => f.Name).ThenBy(f => f.Id) : query.OrderBy(f => f.Name).ThenBy(f => f.Id),
                "brand"    => isDescending ? query.OrderByDescending(f => f.Brand).ThenBy(f => f.Id) : query.OrderBy(f => f.Brand).ThenBy(f => f.Id),
                "material" => isDescending ? query.OrderByDescending(f => f.Material).ThenBy(f => f.Id) : query.OrderBy(f => f.Material).ThenBy(f => f.Id),
                "color"    => isDescending ? query.OrderByDescending(f => f.ColorHex).ThenBy(f => f.Id) : query.OrderBy(f => f.ColorHex).ThenBy(f => f.Id),
                "diameter" => isDescending ? query.OrderByDescending(f => f.Diameter).ThenBy(f => f.Id) : query.OrderBy(f => f.Diameter).ThenBy(f => f.Id),
                _          => query.OrderBy(f => f.Name).ThenBy(f => f.Id)
            };
        }
    }
}

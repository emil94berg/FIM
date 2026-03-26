using FIM.Server.Data;
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

        public async Task<List<FilamentRecordDto>> GetWholeFilamentCatalog(string userId)
        {
            var result = await _dbContext.PublicFilamentCatalogs.Select(f => new FilamentRecordDto(
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
                    _dbContext.UserFavoriteFilaments.Any(uf => uf.UserId == userId && uf.FilamentId == f.Id)
                )).ToListAsync();

            return result;



            //var result = await _dbContext.PublicFilamentCatalogs.ToListAsync();
            
            //return await _dbContext.PublicFilamentCatalogs.ToListAsync();
        }
    }
}

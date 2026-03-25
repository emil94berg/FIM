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
        public async Task<List<PublicFilamentCatalog>> GetWholeFilamentCatalog()
        {
            var test = await _dbContext.PublicFilamentCatalogs.ToListAsync();
            Console.WriteLine(test);
            return await _dbContext.PublicFilamentCatalogs.ToListAsync();
        }
    }
}

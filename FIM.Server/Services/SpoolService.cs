using FIM.Server.Data;
using FIM.Server.DTOs;
using FIM.Server.Models;
using Microsoft.EntityFrameworkCore;

using FIM.Server.Services.Interfaces;

namespace FIM.Server.Services;

public class SpoolService(ApplicationDbContext dbContext) : ISpoolService
{
    public async Task<IEnumerable<SpoolDto>> GetAllSpoolsAsync()
    {
        var spools = await dbContext.Spools.ToListAsync();
        return spools.Select(SpoolDto.FromSpool);
    }

    public async Task<SpoolDto?> GetSpoolByIdAsync(int id)
    {
        var spool = await dbContext.Spools.FindAsync(id);
        return spool is null ? null : SpoolDto.FromSpool(spool);
    }

    public async Task<SpoolDto> CreateSpoolAsync(Spool spool)
    {
        spool.RemainingWeight = spool.TotalWeight;
        dbContext.Spools.Add(spool);
        await dbContext.SaveChangesAsync();
        return SpoolDto.FromSpool(spool);
    }
}

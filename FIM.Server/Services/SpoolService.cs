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

    public async Task<SpoolDto> CreateSpoolAsync(CreateSpoolDto dto)
    {
        var spool = new Spool
        {
            Brand = dto.Brand,
            Material = dto.Material,
            Color = dto.Color,
            Diameter = dto.Diameter,
            TotalWeight = dto.TotalWeight,
            RemainingWeight = dto.TotalWeight,
            SpoolCost = dto.SpoolCost,
            CreatedAt = DateTime.UtcNow
        };
        dbContext.Spools.Add(spool);
        await dbContext.SaveChangesAsync();
        return SpoolDto.FromSpool(spool);
    }
}

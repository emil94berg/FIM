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

    public async Task<bool> DeleteSpoolAsync(int id)
    {
        var spool = await dbContext.Spools.FindAsync(id);
        if (spool == null)
        {
            return false;
        }
        dbContext.Spools.Remove(spool);
        await dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<SpoolDto?> UpdateSpoolAsync(int id, UpdateSpoolDto dto)
    {
        var spool = await dbContext.Spools.FindAsync(id);
        if (spool == null)
        {
            return null;
        }

        if (dto.Brand != null) spool.Brand = dto.Brand;
        if (dto.Material != null) spool.Material = dto.Material;
        if (dto.Color != null) spool.Color = dto.Color;
        if (dto.Diameter.HasValue) spool.Diameter = dto.Diameter.Value;
        if (dto.TotalWeight.HasValue)        
        {
            if (spool.TotalWeight != spool.RemainingWeight)
            {
                throw new InvalidOperationException("Total weight cannot be changed after the spool has been used.");
            }

            spool.TotalWeight = dto.TotalWeight.Value;
            if (spool.RemainingWeight > spool.TotalWeight)
            {
                spool.RemainingWeight = spool.TotalWeight;
            }
        }
        if (dto.SpoolCost.HasValue) spool.SpoolCost = dto.SpoolCost.Value;

        await dbContext.SaveChangesAsync();
        return SpoolDto.FromSpool(spool);
    }
}

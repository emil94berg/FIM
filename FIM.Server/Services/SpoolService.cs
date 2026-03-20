using FIM.Server.Data;
using FIM.Server.DTOs;
using FIM.Server.Models;
using Microsoft.EntityFrameworkCore;

using FIM.Server.Services.Interfaces;

namespace FIM.Server.Services;

public class SpoolService(ApplicationDbContext dbContext) : ISpoolService
{
    public async Task<IEnumerable<SpoolDto>> GetAllSpoolsAsync(string userId)
    {
        var spools = await dbContext.Spools.Where(s => s.UserId == userId).ToListAsync();
        return spools.Select(SpoolDto.FromSpool);
    }

    public async Task<SpoolDto?> GetSpoolByIdAsync(int id, string userId)
    {
        var spool = await dbContext.Spools.FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);
        return spool is null ? null : SpoolDto.FromSpool(spool);
    }

    public async Task<SpoolDto> CreateSpoolAsync(CreateSpoolDto dto, string userId)
    {
        var spool = new Spool
        {
            UserId = userId,
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

    public async Task<bool> DeleteSpoolAsync(int id, string userId)
    {
         var spool = await dbContext.Spools.FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);
        if (spool == null)
        {
            return false;
        }
        dbContext.Spools.Remove(spool);
        await dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<SpoolDto?> UpdateSpoolAsync(int id, UpdateSpoolDto dto, string userId)
    {
        var spool = await dbContext.Spools.FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);
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
    public async Task<List<SpoolDto>> GetLowSpools(string userId)
    {
        var list = await dbContext.Spools.Where(s => s.UserId == userId && s.RemainingWeight <= 100).ToListAsync();
        var dtoList = SpoolDto.ToListSpoolDto(list);
        return dtoList;
    }
}

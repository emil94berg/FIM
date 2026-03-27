using FIM.Server.Data;
using FIM.Server.DTOs.SpoolDtos;
using FIM.Server.Models;
using FIM.Server.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using static FIM.Server.DTOs.Filament.FilamentRecord;

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
        string diameterText = dto.Diameter.ToString().Replace(",", "");
        var spool = new Spool
        {
            UserId = userId,
            Identifier = $"{dto.Brand}_{dto.Material}_{dto.ColorName}_{diameterText}",
            ColorHex = dto.ColorHex,
            ColorHexes = dto.ColorHexes,
            ExtruderTemp = dto.ExtruderTemp,
            BedTemp = dto.BedTemp,
            Finish = dto.Finish,
            Translucent = dto.Translucent,
            Glow = dto.Glow,
            Brand = dto.Brand,
            Material = dto.Material,
            ColorName = dto.ColorName,
            Diameter = dto.Diameter,
            TotalWeight = dto.TotalWeight,
            RemainingWeight = dto.TotalWeight,
            SpoolCost = dto.SpoolCost,
            CreatedAt = DateTime.UtcNow,
            Favorite = false
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
        if (dto.ColorName != null) spool.ColorName = dto.ColorName;
        if (dto.ColorHex != null) spool.ColorHex = dto.ColorHex;
        if (dto.ColorHexes != null) spool.ColorHexes = dto.ColorHexes;
        if (dto.ExtruderTemp.HasValue) spool.ExtruderTemp = dto.ExtruderTemp.Value;
        if (dto.BedTemp.HasValue) spool.BedTemp = dto.BedTemp.Value;
        if (dto.Finish != null) spool.Finish = dto.Finish;
        if (dto.Glow.HasValue) spool.Glow = dto.Glow.Value;
        if (dto.Favorite.HasValue) spool.Favorite = dto.Favorite.Value;
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

        spool.Identifier = $"{dto.Brand}_{dto.Material}_{dto.ColorName}";

        await dbContext.SaveChangesAsync();
        return SpoolDto.FromSpool(spool);
    }
    public async Task<List<SpoolDto>> GetLowSpools(string userId)
    {
        var list = await dbContext.Spools.Where(s => s.UserId == userId && s.RemainingWeight <= 100).ToListAsync();
        var dtoList = SpoolDto.ToListSpoolDto(list);
        return dtoList;
    }

    public async Task<bool> AddToSpoolFromFavorite(FilamentRecordDto dto, string userId, int price)
    {
        var spool = new Spool()
        {
            UserId = userId,
            Material = dto.material,
            Identifier = dto.identifier,
            TotalWeight = dto.weight,
            RemainingWeight = dto.weight,
            SpoolCost = price,
            ColorName = dto.name,
            ColorHex = dto.colorHex,
            ColorHexes = dto.colorHexes,
            ExtruderTemp = dto.extruderTemp,
            BedTemp = dto.bedTemp,
            Finish = dto.finish,
            Translucent = dto.translucent,
            Glow = dto.glow,
            Brand = dto.brand,
            Diameter = dto.diameter,
            CreatedAt = DateTime.UtcNow,
            Favorite = dto.isFavorite
        };

        var result = dbContext.Spools.Add(spool);

        if (result != null)
        {
            await dbContext.SaveChangesAsync();
            return true;
        }
        else
        {
            return false;
        }
    }
}

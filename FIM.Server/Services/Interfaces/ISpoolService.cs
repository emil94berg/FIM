using FIM.Server.DTOs.SpoolDtos;
using static FIM.Server.DTOs.Filament.FilamentRecord;

namespace FIM.Server.Services.Interfaces;

public interface ISpoolService
{
    Task<IEnumerable<SpoolDto>> GetAllSpoolsAsync(string userId);
    Task<SpoolDto?> GetSpoolByIdAsync(int id, string userId);
    Task<SpoolDto> CreateSpoolAsync(CreateSpoolDto dto, string userId);
    Task<SpoolDto> DeleteSpoolAsync(int id, string userId);
    Task<SpoolDto?> UpdateSpoolAsync(int id, UpdateSpoolDto dto, string userId);
    Task<List<SpoolDto>> GetLowSpools(string userId);
    Task<SpoolDto> AddToSpoolFromFavorite(FilamentRecordDto dto, string userId, decimal price);
    Task<SpoolDto> UpdateSpoolWeightAsync(SpoolWeightDto spoolWeightDto, string usedId);
    Task<IEnumerable<SpoolDto>> GetAllDeletedSpoolsAsync(string usedId);
    Task<SpoolDto> ChangeDeletedStatusAsync(SpoolDto dto, string userId);
    Task<List<SpoolGroupDto>> GroupBySpoolIdentifier(string userId);
}

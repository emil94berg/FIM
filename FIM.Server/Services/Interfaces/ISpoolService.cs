using FIM.Server.DTOs.SpoolDtos;

namespace FIM.Server.Services.Interfaces;

public interface ISpoolService
{
    Task<IEnumerable<SpoolDto>> GetAllSpoolsAsync(string userId);
    Task<SpoolDto?> GetSpoolByIdAsync(int id, string userId);
    Task<SpoolDto> CreateSpoolAsync(CreateSpoolDto dto, string userId);
    Task<bool> DeleteSpoolAsync(int id, string userId);
    Task<SpoolDto?> UpdateSpoolAsync(int id, UpdateSpoolDto dto, string userId);
}

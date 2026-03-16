using FIM.Server.DTOs;

namespace FIM.Server.Services.Interfaces;

public interface ISpoolService
{
    Task<IEnumerable<SpoolDto>> GetAllSpoolsAsync();
    Task<SpoolDto?> GetSpoolByIdAsync(int id);
    Task<SpoolDto> CreateSpoolAsync(CreateSpoolDto dto);
}

using FIM.Server.DTOs;
using FIM.Server.Models;

namespace FIM.Server.Services.Interfaces;

public interface ISpoolService
{
    Task<IEnumerable<SpoolDto>> GetAllSpoolsAsync();
    Task<SpoolDto?> GetSpoolByIdAsync(int id);
    Task<SpoolDto> CreateSpoolAsync(Spool spool);
}

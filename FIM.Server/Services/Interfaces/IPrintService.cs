using FIM.Server.DTOs.PrintDtos;
using FIM.Server.Models;

namespace FIM.Server.Services.Interfaces
{
    public interface IPrintService
    {
        Task<List<PrintDto>> GetAllPrintsAsync(string userId);
        Task<PrintDto> CreatePrintAsync(CreatePrintDto createPrintDto, string userId);
        Task<bool> DeletePrintAsync(int id , string userId);
        Task<PrintDto?> UpdatePrintAsync(int id, UpdatePrintDto dto, string userId);
    }
}

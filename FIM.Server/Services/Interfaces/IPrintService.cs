using FIM.Server.Models;

namespace FIM.Server.Services.Interfaces
{
    public interface IPrintService
    {
        Task<List<Print>> GetAllPrintsAsync();
        Task<Print> CreatePrintAsync(Print print);
        Task<bool> DeletePrintAsync(int id);
        Task<Print?> UpdatePrintAsync(int id, Print updatedPrint);
    }
}

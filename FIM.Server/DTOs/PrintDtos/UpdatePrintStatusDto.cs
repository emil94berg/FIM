using FIM.Server.Models;

namespace FIM.Server.DTOs.PrintDtos
{
    public record UpdatePrintStatusDto(
            int Id,
            PrintStatus Status
        );
}

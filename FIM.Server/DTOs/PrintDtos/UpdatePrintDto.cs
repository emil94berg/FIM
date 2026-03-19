using FIM.Server.Models;

namespace FIM.Server.DTOs.PrintDtos
{
    public record UpdatePrintDto(
          string? Name,
          int? SpoolId,
          double? GramsUsed,
          PrintStatus? Status
    );
}

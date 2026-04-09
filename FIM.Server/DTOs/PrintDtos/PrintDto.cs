using FIM.Server.Models;

namespace FIM.Server.DTOs.PrintDtos
{
    public record PrintDto(
        int Id,
        string Name,
        int SpoolId,
        double GramsUsed,
        PrintStatus Status,
        DateTime CreatedAt,
        DateTime? StartedAt,
        DateTime? EstimatedEndTime,
        DateTime? CompletedAt,
        Spool? Spool
    ); 
}
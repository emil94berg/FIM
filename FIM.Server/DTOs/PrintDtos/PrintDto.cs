using FIM.Server.Models;

namespace FIM.Server.DTOs.PrintDtos
{
    public record PrintDto(
        int Id,
        string Name,
        int SpoolId,
        double GramsUsed,
        bool isDeleted,
        PrintStatus Status,
        DateTime CreatedAt,
        DateTime? StartedAt,
        DateTime? EstimatedEndTime,
        Spool? Spool
    ); 
}
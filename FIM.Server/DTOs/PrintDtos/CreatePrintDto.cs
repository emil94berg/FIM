using FIM.Server.Models;

namespace FIM.Server.DTOs.PrintDtos;

public record CreatePrintDto(
    string Name,
    int SpoolId, 
    int GramsUsed,
    PrintStatus Status
);


using FIM.Server.Models;

namespace FIM.Server.DTOs.PrintDtos;

public record CreatePrintDto(
    string Name,
    int SpoolId, 
    double GramsUsed,
    PrintStatus Status
);


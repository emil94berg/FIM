namespace FIM.Server.DTOs;

public record UpdateSpoolDto(
    string? Brand,
    string? Material,
    string? Color,
    double? Diameter,
    double? TotalWeight,
    decimal? SpoolCost
);
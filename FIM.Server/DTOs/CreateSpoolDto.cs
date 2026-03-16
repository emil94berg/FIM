namespace FIM.Server.DTOs;

public record CreateSpoolDto(
    string Brand,
    string Material,
    string Color,
    double Diameter,
    double TotalWeight,
    decimal SpoolCost
);

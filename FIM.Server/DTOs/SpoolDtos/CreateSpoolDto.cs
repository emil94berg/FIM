namespace FIM.Server.DTOs.SpoolDtos
{
    public record CreateSpoolDto(
        string Brand,
        string Material,
        string Color,
        double Diameter,
        double TotalWeight,
        decimal SpoolCost
    );
}

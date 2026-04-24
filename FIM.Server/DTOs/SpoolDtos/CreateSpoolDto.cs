namespace FIM.Server.DTOs.SpoolDtos
{
    public record CreateSpoolDto(
        string? ColorHex,
        List<string>? ColorHexes,
        int? ExtruderTemp,
        int? BedTemp,
        string? Finish,
        bool Translucent,
        bool Glow,
        string Brand,
        string Material,
        string ColorName,
        double Diameter,
        double TotalWeight,
        decimal SpoolCost,
        string? ProductUrl,
        string? Notes
    );
}

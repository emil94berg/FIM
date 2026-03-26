namespace FIM.Server.DTOs.SpoolDtos
{
    public record UpdateSpoolDto(
        string? Identifier,
        string? ColorHex,
        List<string>? ColorHexes,
        int? ExtruderTemp,
        int? BedTemp,
        string? Finish,
        bool? Translucent,
        bool? Glow,
        string? Brand,
        string? Material,
        string? ColorName,
        double? Diameter,
        double? TotalWeight,
        double? RemainingWeight,
        decimal? SpoolCost,
        bool? Favorite
    );
}
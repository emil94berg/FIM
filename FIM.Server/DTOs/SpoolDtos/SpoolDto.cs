using FIM.Server.Models;

namespace FIM.Server.DTOs.SpoolDtos
{
    public record SpoolDto(
        int Id,
        string Identifier,
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
        double RemainingWeight,
        decimal SpoolCost,
        DateTime CreatedAt
    )
    {
        public static SpoolDto FromSpool(Spool spool) =>
            new(
                spool.Id,
                spool.Identifier,
                spool.ColorHex,
                spool.ColorHexes,
                spool.ExtruderTemp,
                spool.BedTemp,
                spool.Finish,
                spool.Translucent,
                spool.Glow,
                spool.Brand,
                spool.Material,
                spool.ColorName,
                spool.Diameter,
                spool.TotalWeight,
                spool.RemainingWeight,
                spool.SpoolCost,
                spool.CreatedAt
            );
        public static List<SpoolDto> ToListSpoolDto(List<Spool> spools)
        {
            List<SpoolDto> spoolDtos = new List<SpoolDto>();
            foreach (var s in spools)
            {
                var spoolDto = FromSpool(s);
                spoolDtos.Add(spoolDto);
            }
            return spoolDtos;
        }
    }

}

using FIM.Server.Models;

namespace FIM.Server.DTOs.SpoolDtos
{
    public record SpoolDto(
        int Id,
        string Brand,
        string Material,
        string Color,
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
                spool.Brand,
                spool.Material,
                spool.Color,
                spool.Diameter,
                spool.TotalWeight,
                spool.RemainingWeight,
                spool.SpoolCost,
                spool.CreatedAt
            );
    }
}

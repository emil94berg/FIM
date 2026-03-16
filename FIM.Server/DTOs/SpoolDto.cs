namespace FIM.Server.DTOs;

public record SpoolDto(
    int Id,
    string UserId,
    string Brand,
    string Material,
    string Color,
    double TotalWeight,
    double RemainingWeight,
    decimal SpoolCost,
    DateTime CreatedAt
)
{
    public static SpoolDto FromSpool(Models.Spool spool) =>
        new(
            spool.Id,
            spool.UserId,
            spool.Brand,
            spool.Material,
            spool.Color,
            spool.TotalWeight,
            spool.RemainingWeight,
            spool.SpoolCost,
            spool.CreatedAt
        );
}

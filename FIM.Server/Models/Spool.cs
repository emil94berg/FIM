namespace FIM.Server.Models;

public class Spool
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string Material { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public double TotalWeight { get; set; }
    public double RemainingWeight { get; set; }
    public decimal SpoolCost { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

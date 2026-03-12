namespace FIM.Server.Models;

public class Print
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int SpoolId { get; set; }
    public double GramsUsed { get; set; }
    public PrintStatus Status { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Spool Spool { get; set; }
}
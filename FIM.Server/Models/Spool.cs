using System.ComponentModel.DataAnnotations;

namespace FIM.Server.Models;

public class Spool
{
    public int Id { get; set; }
    [Required(ErrorMessage = "User ID is required")]
    public string UserId { get; set; } = string.Empty;
    [Required(ErrorMessage = "Brand is required")]
    public required string Brand { get; set; } = string.Empty;
    [Required(ErrorMessage = "Material is required")]
    public required string Material { get; set; } = string.Empty;
    [Required(ErrorMessage = "Color is required")]
    public required string Color { get; set; } = string.Empty;
    [Required(ErrorMessage = "Diameter is required")]
    public required double Diameter { get; set; }
    [Required(ErrorMessage = "Total Weight is required")]
    public required double TotalWeight { get; set; }
    public double RemainingWeight { get; set; }
    [Required(ErrorMessage = "Spool Cost is required")]
    public required decimal SpoolCost { get; set; }
    public required DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

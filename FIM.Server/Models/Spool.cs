using System.ComponentModel.DataAnnotations;

namespace FIM.Server.Models;

public class Spool
{
    public int Id { get; set; }
    [Required(ErrorMessage = "User ID is required")]
    public string UserId { get; set; } = string.Empty;
    public string Identifier { get; set; }
    [Required(ErrorMessage = "Color name is required")]
    public string ColorName { get; set; }
    public string? ColorHex { get; set; }
    public List<string>? ColorHexes { get; set; }
    public int? ExtruderTemp { get; set; }
    public int? BedTemp { get; set; }
    public string? Finish { get; set; }
    public bool Translucent { get; set; }
    public bool Glow { get; set; }
    [Required(ErrorMessage = "Brand is required")]
    public required string Brand { get; set; } = string.Empty;
    [Required(ErrorMessage = "Material is required")]
    public required string Material { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Diameter is required")]
    public required double Diameter { get; set; }
    [Required(ErrorMessage = "Total Weight is required")]
    public required double TotalWeight { get; set; }
    public double RemainingWeight { get; set; }
    [Required(ErrorMessage = "Spool Cost is required")]
    public required decimal SpoolCost { get; set; }
    public required DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool Favorite { get; set; } = false;
}
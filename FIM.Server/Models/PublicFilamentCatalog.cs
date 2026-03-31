using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
namespace FIM.Server.Models
{
    public class PublicFilamentCatalog
    {
        [JsonIgnore]
        public int Id { get; set; } 
        [JsonPropertyName("id")]
        [Required]
        [MaxLength(200)]
        public string Identifier { get; set; }
        [JsonPropertyName("manufacturer")]
        [Required]
        [MaxLength(100)]
        public string Brand { get; set; }
        [JsonPropertyName("name")]
        [Required]
        [MaxLength(50)]
        public string Name { get; set; }
        [JsonPropertyName("material")]
        [Required]
        [MaxLength(50)]
        public string Material { get; set; }
        [JsonPropertyName("weight")]
        [Range(0.01, 5000)]
        public double Weight { get; set; }
        [JsonPropertyName("diameter")]
        [Range(0.1, 10)]
        public double Diameter { get; set; }
        [JsonPropertyName("color_hex")]
        [MaxLength(8)]
        public string? ColorHex { get; set; }
        [JsonPropertyName("color_hexes")]
        public List<string>? ColorHexes { get; set; }
        [JsonPropertyName("extruder_temp")]
        [Range(0, 500)]
        public int? ExtruderTemp { get; set; }
        [JsonPropertyName("bed_temp")]
        [Range(0, 200)]
        public int? BedTemp { get; set; }
        [JsonPropertyName("finish")]
        [MaxLength(50)]
        public string? Finish { get; set; }
        [JsonPropertyName("translucent")]
        public bool Translucent { get; set; }
        [JsonPropertyName("glow")]
        public bool Glow { get; set; }
        public ICollection<UserFavoriteFilament> FavoritedBy { get; set; }
    }
}


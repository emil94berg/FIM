using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FIM.Server.Models
{
    public class PublicFilamentCatalog
    {
        [JsonIgnore]
        public int Id { get; set; } 
        [JsonPropertyName("id")]
        public string Identifier { get; set; }
        [JsonPropertyName("manufacturer")]
        public string Brand { get; set; }
        [JsonPropertyName("name")]
        public string Name { get; set; }
        [JsonPropertyName("material")]
        public string Material { get; set; }
        [JsonPropertyName("weight")]
        public double Weight { get; set; }
        [JsonPropertyName("diameter")]
        public double Diameter { get; set; }
        [JsonPropertyName("color_hex")]
        public string? ColorHex { get; set; }
        [JsonPropertyName("color_hexes")]
        public List<string>? ColorHexes { get; set; }
        [JsonPropertyName("extruder_temp")]
        public int? ExtruderTemp { get; set; }
        [JsonPropertyName("bed_temp")]
        public int? BedTemp { get; set; }
        [JsonPropertyName("finish")]
        public string? Finish { get; set; }
        [JsonPropertyName("translucent")]
        public bool Translucent { get; set; }
        [JsonPropertyName("glow")]
        public bool Glow { get; set; }
        public ICollection<UserFavoriteFilament> FavoritedBy { get; set; }
    }
}

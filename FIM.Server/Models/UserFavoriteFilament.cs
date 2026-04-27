namespace FIM.Server.Models
{
    public class UserFavoriteFilament
    {
        public string UserId { get; set; }
        public int FilamentId { get; set; }

        public PublicFilamentCatalog Filament { get; set; }
    }
}

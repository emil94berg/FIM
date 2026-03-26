using Microsoft.EntityFrameworkCore;
using FIM.Server.Models;
using FIM.Server.DTOs.Filament;

namespace FIM.Server.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<Spool> Spools { get; set; }
    public DbSet<Print> Prints { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<PublicFilamentCatalog> PublicFilamentCatalogs { get; set; }
    public DbSet<UserFavoriteFilament> UserFavoriteFilaments { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Spool>()
            .Property(s => s.SpoolCost)
            .HasPrecision(18, 2);

        modelBuilder.Entity<UserFavoriteFilament>()
            .HasKey(x => new { x.UserId, x.FilamentId });

        modelBuilder.Entity<UserFavoriteFilament>()
            .HasOne(x => x.Filament)
            .WithMany(x => x.FavoritedBy)
            .HasForeignKey(x => x.FilamentId);

    }
}

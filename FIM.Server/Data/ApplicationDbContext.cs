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


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Spool>()
            .Property(s => s.SpoolCost)
            .HasPrecision(18, 2);
    }
}

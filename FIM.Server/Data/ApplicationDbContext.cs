using Microsoft.EntityFrameworkCore;
using FIM.Server.Models;

namespace FIM.Server.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<Spool> Spools { get; set; }
    public DbSet<Print> Prints { get; set; }
    public DbSet<Notification> Notifications { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Spool>()
            .Property(s => s.SpoolCost)
            .HasPrecision(18, 2);
    }
}

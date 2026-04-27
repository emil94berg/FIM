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
    public DbSet<ForumPost> ForumPosts { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<UserVotes> UserVotes { get; set; }


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

        modelBuilder.Entity<PublicFilamentCatalog>(entity =>
        {
            entity.ToTable("PublicFilamentCatalogs");

            entity.Property(e => e.Identifier).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Brand).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Name).HasMaxLength(50).IsRequired();
            entity.Property(e => e.Material).HasMaxLength(50).IsRequired();
            entity.Property(e => e.ColorHex).HasMaxLength(8);
            entity.Property(e => e.Finish).HasMaxLength(50);

            entity.HasCheckConstraint("CK_PublicFilament_Weight_Positive", "[Weight] > 0");
            entity.HasCheckConstraint("CK_PublicFilament_Diameter_Range", "[Diameter] > 0 AND [Diameter] <= 10");
            entity.HasCheckConstraint("CK_PublicFilament_ExtruderTemp_Range", "[ExtruderTemp] IS NULL OR ([ExtruderTemp] >= 0 AND [ExtruderTemp] <= 500)");
            entity.HasCheckConstraint("CK_PublicFilament_BedTemp_Range", "[BedTemp] IS NULL OR ([BedTemp] >= 0 AND [BedTemp] <= 200)");

            entity.HasIndex(e => e.Name).HasDatabaseName("IX_PublicFilament_Name");
            entity.HasIndex(e => e.Material).HasDatabaseName("IX_PublicFilament_Material");
            entity.HasIndex(e => e.ColorHex).HasDatabaseName("IX_PublicFilament_ColorHex");
            entity.HasIndex(e => e.Diameter).HasDatabaseName("IX_PublicFilament_Diameter");
            entity.HasIndex(e => e.Id).HasDatabaseName("IX_PublicFilament_Id");

            entity.HasIndex(e => new { e.Name, e.Id})
                .HasDatabaseName("IX_PublicFilament_Sort_Name");

            entity.HasIndex(e => new { e.Material, e.Id})
                .HasDatabaseName("IX_PublicFilament_Sort_Material");

            entity.HasIndex(e => new { e.ColorHex, e.Id})
                .HasDatabaseName("IX_PublicFilament_Sort_ColorHex");

            entity.HasIndex(e => new { e.Diameter, e.Id})
                .HasDatabaseName("IX_PublicFilament_Sort_Diameter");
        });
    }
}

using FIM.Server.DTOs.SpoolDtos;
using FIM.Server.Models;
using FIM.Server.Services;
using FIM.Server.Tests.TestInfrastructure;
using Microsoft.EntityFrameworkCore;

namespace FIM.Server.Tests.Services;

public class SpoolServiceTests
{
    [Fact]
    public async Task CreateSpoolAsync_SetsExpectedDefaultsAndIdentifier()
    {
        // Arrange
        using var factory = new SqliteInMemoryDbContextFactory();
        await using var context = factory.CreateDbContext();
        var service = new SpoolService(context);

        var dto = new CreateSpoolDto(
            "#FFFFFF",
            new List<string> { "#FFFFFF", "#000000" },
            210,
            60,
            "Matte",
            false,
            false,
            "Prusament",
            "PLA",
            "Arctic White",
            1.75,
            1000,
            29.99m,
            "https://example.com/spool",
            "Test spool");

        // Act
        var result = await service.CreateSpoolAsync(dto, "user-1");

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Prusament_PLA_Arctic White_175", result.Identifier);
        Assert.Equal(1000, result.TotalWeight);
        Assert.Equal(1000, result.RemainingWeight);
        Assert.False(result.IsDeleted);
        Assert.False(result.Favorite);

        var saved = await context.Spools.FindAsync(result.Id);
        Assert.NotNull(saved);
        Assert.Equal("user-1", saved.UserId);
        Assert.Equal("Prusament", saved.Brand);
    }

    [Fact]
    public async Task UpdateSpoolAsync_WhenSpoolExists_UpdatesFieldsAndRebuildsIdentifier()
    {
        // Arrange
        using var factory = new SqliteInMemoryDbContextFactory();
        await using var context = factory.CreateDbContext();

        context.Spools.Add(new Spool
        {
            UserId = "user-1",
            Identifier = "OldBrand_PLA_Red_1.75",
            Brand = "OldBrand",
            Material = "PLA",
            ColorName = "Red",
            Diameter = 1.75,
            TotalWeight = 1000,
            RemainingWeight = 700,
            SpoolCost = 20,
            CreatedAt = DateTime.UtcNow,
            Favorite = false,
            IsDeleted = false
        });
        await context.SaveChangesAsync();

        var existing = await context.Spools.SingleAsync();
        var service = new SpoolService(context);

        var updateDto = new UpdateSpoolDto(
            null,
            "#00FF00",
            null,
            null,
            null,
            null,
            null,
            null,
            "Bambu",
            "PETG",
            "Green",
            1.75,
            null,
            650,
            null,
            true,
            null,
            null,
            "Updated notes");

        // Act
        var result = await service.UpdateSpoolAsync(existing.Id, updateDto, "user-1");

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Bambu_PETG_Green_175", result.Identifier);
        Assert.Equal("Bambu", result.Brand);
        Assert.Equal("PETG", result.Material);
        Assert.Equal("Green", result.ColorName);
        Assert.Equal(650, result.RemainingWeight);
        Assert.True(result.Favorite);
        Assert.Equal("Updated notes", result.Notes);
    }

    [Fact]
    public async Task GroupBySpoolIdentifier_ReturnsGroupedSpoolsForUserAndExcludesDeleted()
    {
        // Arrange
        using var factory = new SqliteInMemoryDbContextFactory();
        await using var context = factory.CreateDbContext();

        context.Spools.AddRange(
            new Spool
            {
                UserId = "user-1",
                Identifier = "GroupA",
                Brand = "BrandA",
                Material = "PLA",
                ColorName = "White",
                Diameter = 1.75,
                TotalWeight = 1000,
                RemainingWeight = 400,
                SpoolCost = 20,
                CreatedAt = DateTime.UtcNow,
                IsDeleted = false
            },
            new Spool
            {
                UserId = "user-1",
                Identifier = "GroupA",
                Brand = "BrandA",
                Material = "PLA",
                ColorName = "White",
                Diameter = 1.75,
                TotalWeight = 1000,
                RemainingWeight = 300,
                SpoolCost = 20,
                CreatedAt = DateTime.UtcNow,
                IsDeleted = false
            },
            new Spool
            {
                UserId = "user-1",
                Identifier = "GroupB",
                Brand = "BrandB",
                Material = "PETG",
                ColorName = "Black",
                Diameter = 1.75,
                TotalWeight = 1000,
                RemainingWeight = 900,
                SpoolCost = 25,
                CreatedAt = DateTime.UtcNow,
                IsDeleted = true
            },
            new Spool
            {
                UserId = "user-2",
                Identifier = "GroupA",
                Brand = "BrandA",
                Material = "PLA",
                ColorName = "White",
                Diameter = 1.75,
                TotalWeight = 1000,
                RemainingWeight = 800,
                SpoolCost = 20,
                CreatedAt = DateTime.UtcNow,
                IsDeleted = false
            });
        await context.SaveChangesAsync();

        var service = new SpoolService(context);

        // Act
        var result = await service.GroupBySpoolIdentifier("user-1");

        // Assert
        Assert.Single(result);
        Assert.Equal("GroupA", result[0].Identifier);
        Assert.Equal(2, result[0].Spools.Count);
        Assert.All(result[0].Spools, spool => Assert.False(spool.IsDeleted));
    }

    [Fact]
    public async Task GetAllSpoolsAsync_ReturnsOnlyCurrentUserAndNotDeleted()
    {
        // Arrange
        using var factory = new SqliteInMemoryDbContextFactory();
        await using var context = factory.CreateDbContext();

        context.Spools.AddRange(
            BuildSpool("user-1", "KeepA", isDeleted: false),
            BuildSpool("user-1", "DeletedA", isDeleted: true),
            BuildSpool("user-2", "OtherUser", isDeleted: false),
            BuildSpool("user-1", "KeepB", isDeleted: false));

        await context.SaveChangesAsync();

        var service = new SpoolService(context);

        // Act
        var result = (await service.GetAllSpoolsAsync("user-1")).ToList();

        // Assert
        Assert.Equal(2, result.Count);
        Assert.Contains(result, s => s.Identifier == "KeepA");
        Assert.Contains(result, s => s.Identifier == "KeepB");
        Assert.DoesNotContain(result, s => s.Identifier == "DeletedA");
        Assert.DoesNotContain(result, s => s.Identifier == "OtherUser");
    }

    [Fact]
    public async Task GetSpoolByIdAsync_ReturnsNullForWrongUserAndMissingId()
    {
        // Arrange
        using var factory = new SqliteInMemoryDbContextFactory();
        await using var context = factory.CreateDbContext();

        var spool = BuildSpool("user-1", "OwnedSpool", isDeleted: false);
        context.Spools.Add(spool);
        await context.SaveChangesAsync();

        var service = new SpoolService(context);

        // Act
        var wrongUserResult = await service.GetSpoolByIdAsync(spool.Id, "user-2");
        var missingResult = await service.GetSpoolByIdAsync(99999, "user-1");

        // Assert
        Assert.Null(wrongUserResult);
        Assert.Null(missingResult);
    }

    [Fact]
    public async Task DeleteSpoolAsync_WhenSpoolExists_SetsIsDeletedTrue()
    {
        // Arrange
        using var factory = new SqliteInMemoryDbContextFactory();
        await using var context = factory.CreateDbContext();

        var spool = BuildSpool("user-1", "ToDelete", isDeleted: false);
        context.Spools.Add(spool);
        await context.SaveChangesAsync();

        var service = new SpoolService(context);

        // Act
        var result = await service.DeleteSpoolAsync(spool.Id, "user-1");

        // Assert
        Assert.NotNull(result);
        Assert.True(result.IsDeleted);

        var reloaded = await context.Spools.FindAsync(spool.Id);
        Assert.NotNull(reloaded);
        Assert.True(reloaded.IsDeleted);
    }

    [Fact]
    public async Task DeleteSpoolAsync_WhenSpoolDoesNotExist_ReturnsNull()
    {
        // Arrange
        using var factory = new SqliteInMemoryDbContextFactory();
        await using var context = factory.CreateDbContext();
        var service = new SpoolService(context);

        // Act
        var result = await service.DeleteSpoolAsync(12345, "user-1");

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task UpdateSpoolAsync_WhenOnlyOneFieldProvided_LeavesOtherFieldsUnchanged()
    {
        // Arrange
        using var factory = new SqliteInMemoryDbContextFactory();
        await using var context = factory.CreateDbContext();

        var spool = BuildSpool("user-1", "Before", isDeleted: false);
        spool.Brand = "BrandBefore";
        spool.Material = "PLA";
        spool.ColorName = "Blue";
        spool.Diameter = 1.75;
        spool.TotalWeight = 1000;
        spool.RemainingWeight = 500;
        spool.SpoolCost = 25;
        spool.Identifier = "BrandBefore_PLA_Blue_175";
        context.Spools.Add(spool);
        await context.SaveChangesAsync();

        var updateDto = new UpdateSpoolDto(
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            true,
            null,
            null,
            null);

        var service = new SpoolService(context);

        // Act
        var result = await service.UpdateSpoolAsync(spool.Id, updateDto, "user-1");

        // Assert
        Assert.NotNull(result);
        Assert.True(result.Favorite);
        Assert.Equal("BrandBefore", result.Brand);
        Assert.Equal("PLA", result.Material);
        Assert.Equal("Blue", result.ColorName);
        Assert.Equal(1.75, result.Diameter);
        Assert.Equal(1000, result.TotalWeight);
        Assert.Equal(500, result.RemainingWeight);
        Assert.Equal(25, result.SpoolCost);
        Assert.Equal("BrandBefore_PLA_Blue_175", result.Identifier);
    }

    [Fact]
    public async Task GetLowSpools_IncludesThresholdAndExcludesAboveThresholdAndDeleted()
    {
        // Arrange
        using var factory = new SqliteInMemoryDbContextFactory();
        await using var context = factory.CreateDbContext();

        var includeAt100 = BuildSpool("user-1", "At100", isDeleted: false);
        includeAt100.RemainingWeight = 100;

        var includeBelow100 = BuildSpool("user-1", "Below100", isDeleted: false);
        includeBelow100.RemainingWeight = 99;

        var excludeAbove100 = BuildSpool("user-1", "Above100", isDeleted: false);
        excludeAbove100.RemainingWeight = 101;

        var excludeDeleted = BuildSpool("user-1", "DeletedLow", isDeleted: true);
        excludeDeleted.RemainingWeight = 50;

        var excludeOtherUser = BuildSpool("user-2", "OtherUserLow", isDeleted: false);
        excludeOtherUser.RemainingWeight = 20;

        context.Spools.AddRange(includeAt100, includeBelow100, excludeAbove100, excludeDeleted, excludeOtherUser);
        await context.SaveChangesAsync();

        var service = new SpoolService(context);

        // Act
        var result = await service.GetLowSpools("user-1");

        // Assert
        Assert.Equal(2, result.Count);
        Assert.Contains(result, s => s.Identifier == "At100");
        Assert.Contains(result, s => s.Identifier == "Below100");
        Assert.DoesNotContain(result, s => s.Identifier == "Above100");
        Assert.DoesNotContain(result, s => s.Identifier == "DeletedLow");
        Assert.DoesNotContain(result, s => s.Identifier == "OtherUserLow");
    }

    private static Spool BuildSpool(string userId, string identifier, bool isDeleted)
    {
        return new Spool
        {
            UserId = userId,
            Identifier = identifier,
            Brand = "GenericBrand",
            Material = "PLA",
            ColorName = "White",
            Diameter = 1.75,
            TotalWeight = 1000,
            RemainingWeight = 500,
            SpoolCost = 20,
            CreatedAt = DateTime.UtcNow,
            IsDeleted = isDeleted,
            Favorite = false
        };
    }
}
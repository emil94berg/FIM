using FIM.Server.Data;
using FIM.Server.DTOs.PrintDtos;
using FIM.Server.DTOs.SpoolDtos;
using FIM.Server.Models;
using FIM.Server.Services;
using FIM.Server.Tests.TestInfrastructure;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;

namespace FIM.Server.Tests.Services;

public class PrintServiceTests
{
    [Fact]
    public async Task CreatePrintAsync_SetsExpectedProperties()
    {
        // Arrange
        using var factory = new SqliteInMemoryDbContextFactory();
        await using var context = factory.CreateDbContext();
        var printService = new PrintService(context);
        var spoolService = new SpoolService(context);

        var spoolDto = new CreateSpoolDto(
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

        await spoolService.CreateSpoolAsync(spoolDto, "User-1");
        await context.SaveChangesAsync();

        var dto = new CreatePrintDto
        (
            "TestPrint1",
            1,
            200);

        // Act
        var result = await printService.CreatePrintAsync(dto, "User-1");


        // Assert
        Assert.NotNull(result);
        Assert.Equal("TestPrint1", result.Name);
        Assert.Equal(1, result.Id);
        Assert.Equal(dto.SpoolId, result.SpoolId);

        var spoolSaved = await context.Spools.FirstOrDefaultAsync(s => s.Id == dto.SpoolId);
        var printSaved = await context.Prints.FirstOrDefaultAsync(p => p.Id == result.Id);
        Assert.NotNull(printSaved);
        Assert.Equal(printSaved.SpoolId, spoolSaved?.Id);
        
    }

    [Fact]
    public async Task DeletePrint_ShouldHardDeletePrintsOnId()
    {
        //Arrange
        using var factory = new SqliteInMemoryDbContextFactory();
        await using var context = factory.CreateDbContext();
        var printService = new PrintService(context);
        var spoolService = new SpoolService(context);

        //Act
        var spoolDto = ExampleCreateSpoolDto();
        var spoolDtoFromDb = spoolService.CreateSpoolAsync(spoolDto, "User-1");

        var printDto = new CreatePrintDto
        (
            "TestPrint1",
            spoolDtoFromDb.Id,
            200);

        var printDtoFromDb = await printService.CreatePrintAsync(printDto, "User-1");


        //Assert
        Assert.NotNull(printDtoFromDb);
        var isDeleted = await printService.DeletePrintAsync(printDtoFromDb.Id, "User-1");
        Assert.True(isDeleted);
    }
    [Fact]
    public async Task DeletePrint_ShouldReturnFalseIfPrintNotFound()
    {
        //Arrange
        using var factory = new SqliteInMemoryDbContextFactory();
        await using var context = factory.CreateDbContext();
        var printService = new PrintService(context);
        //Act
        var isDeleted = await printService.DeletePrintAsync(999, "User-1");
        //Assert
        Assert.False(isDeleted);
    }
    [Fact]
    public async Task UpdatePrint_ShouldUpdatePrintProperties()
    {
        //Arrange
        using var factory = new SqliteInMemoryDbContextFactory();
        await using var context = factory.CreateDbContext();
        var printService = new PrintService(context);
        var spoolService = new SpoolService(context);
        var spoolDto = ExampleCreateSpoolDto();
        var spoolDtoFromDb = await spoolService.CreateSpoolAsync(spoolDto, "User-1");
        var printDto = new CreatePrintDto
        (
            "TestPrint1",
            spoolDtoFromDb.Id,
            200);
        var printDtoFromDb = await printService.CreatePrintAsync(printDto, "User-1");

        //Act
        var updateDto = new UpdatePrintDto
        (
            "UpdatedPrintName",
            null,
            null,
            PrintStatus.Completed,
            null,
            null);


        var updatedPrint = await printService.UpdatePrintAsync(printDtoFromDb.Id, updateDto, "User-1");

        //Assert
        Assert.NotNull(updatedPrint.Print);
        Assert.Equal("UpdatedPrintName", updatedPrint.Print?.Name);
        Assert.Equal(PrintStatus.Completed, updatedPrint.Print?.Status);
    }

    [Fact]
    public async Task GetAllPrints_ShouldReturnAllPrintsForUser()
    {
        //Arrange
        using var factory = new SqliteInMemoryDbContextFactory();
        await using var context = factory.CreateDbContext();
        var printService = new PrintService(context);
        var spoolService = new SpoolService(context);
        var spoolDto = ExampleCreateSpoolDto();
        var spoolDtoFromDb = await spoolService.CreateSpoolAsync(spoolDto, "User-1");
        var printDto1 = new CreatePrintDto
        (
            "TestPrint1",
            spoolDtoFromDb.Id,
            200);
        var printDto2 = new CreatePrintDto
        (
            "TestPrint2",
            spoolDtoFromDb.Id,
            300);
        await printService.CreatePrintAsync(printDto1, "User-1");
        await printService.CreatePrintAsync(printDto2, "User-1");
        await printService.CreatePrintAsync(printDto2, "User-2");

        //Act
        var prints = await printService.GetAllPrintsAsync("User-1");

        //Assert
        Assert.NotNull(prints);
        Assert.Equal(2, prints.Count());
        Assert.True(prints.Count() > 0);
    }
    [Fact]
    public async Task DeletePrint_ShouldSoftDeletePrintOnId()
    {
        //Arrange
        using var factory = new SqliteInMemoryDbContextFactory();
        await using var context = factory.CreateDbContext();
        var printService = new PrintService(context);
        var spoolService = new SpoolService(context);

        var spoolDto = ExampleCreateSpoolDto();
        var spoolDtoFromDb = await spoolService.CreateSpoolAsync(spoolDto, "User-1");
        var printDto = new CreatePrintDto
        (
            "TestPrint1",
            spoolDtoFromDb.Id,
            200);
        var printDtoFromDb = await printService.CreatePrintAsync(printDto, "User-1");


        //Act
        var isDeleted = await printService.DeletePrintAsync(printDtoFromDb.Id, "User-1");

        //Assert
        Assert.True(isDeleted);
        var newlyDeletedPrint = await context.Prints.FirstOrDefaultAsync(p => p.Id == printDtoFromDb.Id);
        Assert.NotNull(newlyDeletedPrint);
        Assert.NotEqual(printDtoFromDb.isDeleted, newlyDeletedPrint.isDeleted);
    }

    [Fact]
    public async Task DeductSpoolForCompletedPrint_ShouldDeductSpoolWeight()
    {
        //Arrange
        using var factory = new SqliteInMemoryDbContextFactory();
        await using var context = factory.CreateDbContext();
        var printService = new PrintService(context);
        var spoolService = new SpoolService(context);

        var spoolDto = ExampleCreateSpoolDto();
        var spoolDtoFromDb = await spoolService.CreateSpoolAsync(spoolDto, "User-1");
        var printDto = new CreatePrintDto
        (
            "TestPrint1",
            spoolDtoFromDb.Id,
            200);
        var printDtoFromDb = await printService.CreatePrintAsync(printDto, "User-1");
        await printService.DeductSpoolForCompletedPrintAsync(printDtoFromDb.Id);

        //Act
        var testThisSpool = await context.Spools.FirstOrDefaultAsync(s => s.Id == spoolDtoFromDb.Id);

        //Assert
        Assert.NotNull(testThisSpool);
        Assert.Equal((spoolDtoFromDb.RemainingWeight - printDtoFromDb.GramsUsed), testThisSpool.RemainingWeight);
    }
    [Fact]
    public async Task ReturnAllPendingPrints()
    {
        //Arrange
        using var factory = new SqliteInMemoryDbContextFactory();
        await using var context = factory.CreateDbContext();
        var printService = new PrintService(context);
        var spoolService = new SpoolService(context);

        var spoolDto = ExampleCreateSpoolDto();
        var spoolDtoFromDb = await spoolService.CreateSpoolAsync(spoolDto, "User-1");


        var print = await SetUpPrintAsync(spoolDtoFromDb.Id, 200);
        var printFromDb = await printService.CreatePrintAsync(new CreatePrintDto(print.Name, print.SpoolId, print.GramsUsed), "User-1");


        //Act



        var pendingPrints = await printService.AllPendingPrintsAsync("User-1");

        //Assert
        Assert.NotNull(pendingPrints);
        Assert.Contains(pendingPrints, p => p.Id == printFromDb.Id);
        Assert.Equal(pendingPrints[0].Status, PrintStatus.Pending);
    }













    public static CreateSpoolDto ExampleCreateSpoolDto()
    {
        return new CreateSpoolDto(
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
    }
    
    public async Task<Print> SetUpPrintAsync(int spoolId, int gramsUsed)
    {
        return new Print
        {
            UserId = "User-1",
            Name = "TestPrint1",
            SpoolId = spoolId,
            GramsUsed = gramsUsed,
            Status = PrintStatus.Pending,
            CreatedAt = DateTime.UtcNow,
            EstimatedEndTime = DateTime.UtcNow.AddMinutes(60),
            StartedAt = DateTime.UtcNow,
            CompletedAt = DateTime.UtcNow.AddMinutes(60),
            isDeleted = false
        };
    }
    
}





public static class ExtensionsClass
{
    public static Print ToPrintFromDto(this PrintDto dto, string userId)
    {
        return new Print
        {
            Id = dto.Id,
            Name = dto.Name,
            SpoolId = dto.SpoolId,
            UserId = userId,
            CreatedAt = dto.CreatedAt
        };
    }
}
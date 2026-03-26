using FIM.Server.Data;
using FIM.Server.DTOs.Filament;
using FIM.Server.Models;
using FIM.Server.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using static System.Net.WebRequestMethods;

namespace FIM.Server.BackgroundServices;

public class NotificationBackgroundService : BackgroundService
{
    private DateTime _nextFilamentUpdate = DateTime.UtcNow;

    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<NotificationBackgroundService> _logger;

    public NotificationBackgroundService(IServiceScopeFactory scopeFactory, ILogger<NotificationBackgroundService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Notification Service is starting.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await CheckNotificationsAsync();

                await RunWeeklyUpdateCatalog();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while checking notifications. Error:" + ex.Message);
            }

            await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken);
        }
    }

    

    private async Task CheckNotificationsAsync()
    {
        using var scope = _scopeFactory.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var printService = scope.ServiceProvider.GetRequiredService<IPrintService>();

        var lowSpools = await dbContext.Spools
            .Where(s => s.RemainingWeight < 100)
            .ToListAsync();
        
        foreach (var spool in lowSpools)
        {
            var exists = await dbContext.Notifications.AnyAsync( n =>
                n.UserId == spool.UserId &&
                n.Type == "LowSpool" &&
                n.Message.Contains($"Spool {spool.Brand} is low")
            );

            if (!exists)
            {
                _logger.LogInformation($"Adding notification for {spool.UserId}, low spool: {spool.Id}-{spool.Brand}. Time: {DateTime.UtcNow}");
                dbContext.Notifications.Add(new Notification
                {
                    UserId = spool.UserId,
                    Type = "LowSpool",
                    Message = $"Spool {spool.Brand} is low on material. Remaining weight: {spool.RemainingWeight}g",
                    IsRead = false,
                    CreatedAt = DateTime.UtcNow
                });
            }
        }

        var overduePrints = await dbContext.Prints
            .Where(p => p.Status == PrintStatus.Printing && p.EstimatedEndTime != null && p.EstimatedEndTime <= DateTime.UtcNow)
            .ToListAsync();
            
        foreach (var print in overduePrints)
        {
            _logger.LogInformation($"Auto-completing print: {print.Name} (ID: {print.Id})");
            print.Status = PrintStatus.Completed;
            await printService.DeductSpoolForCompletedPrintAsync(print.Id);
        }

        var finishedPrints = await dbContext.Prints
            .Where(p => p.Status == PrintStatus.Completed)
            .ToListAsync();

        foreach (var print in finishedPrints)
        {
            var exists = await dbContext.Notifications.AnyAsync(n =>
                n.Type == "PRINT_FINISHED" &&
                n.Message.Contains($"Print '{print.Name}' is finished")
            );

            if (!exists)
            {
                _logger.LogInformation($"Adding notification for finished print: {print.Name}");
                dbContext.Notifications.Add(new Notification
                {
                    UserId = print.UserId,
                    Message = $"Print '{print.Name}' is finished",
                    Type = "PRINT_FINISHED",
                    IsRead = false,
                    CreatedAt = DateTime.UtcNow,
                });
            }
        }
        await dbContext.SaveChangesAsync();
    }


    private async Task RunWeeklyUpdateCatalog()
    {
        if(DateTime.UtcNow < _nextFilamentUpdate)
        {
            return;
        }
        _logger.LogInformation("Running weekly filament catalog update...");

        await UpdateFilamentCatalogAsync();

        _nextFilamentUpdate = DateTime.UtcNow.AddDays(7);
    }

    private async Task UpdateFilamentCatalogAsync()
    {
        using var scope = _scopeFactory.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        var existingFilamentCatalog = await dbContext.PublicFilamentCatalogs.AsNoTracking().ToListAsync();

        var existingSet = existingFilamentCatalog.Select(s => s.Identifier).ToHashSet();

        var filamentCatalogList = new List<PublicFilamentCatalog>();

        string uri = "filaments.json";
        var client = new HttpClient();
        //string baseAddress = "https://donkie.github.io/SpoolmanDB/";
        //client.BaseAddress = new Uri(baseAddress);

        HttpResponseMessage response = await client.GetAsync("https://donkie.github.io/SpoolmanDB/filaments.json");
        if (response.IsSuccessStatusCode)
        {
            string responseString = await response.Content.ReadAsStringAsync();
            filamentCatalogList = JsonSerializer.Deserialize<List<PublicFilamentCatalog>>(responseString);
        }
        Console.WriteLine(filamentCatalogList);
        if(filamentCatalogList != null)
        {
            var newFilaments = filamentCatalogList.Where(f => !existingSet.Contains(f.Identifier)).ToList();
            if (newFilaments.Any())
            {
                await dbContext.PublicFilamentCatalogs.AddRangeAsync(newFilaments);
                await dbContext.SaveChangesAsync();
            }
        }
    }
}
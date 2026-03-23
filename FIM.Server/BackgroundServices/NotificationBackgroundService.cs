using FIM.Server.Data;
using FIM.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace FIM.Server.BackgroundServices;

public class NotificationBackgroundService : BackgroundService
{
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
}
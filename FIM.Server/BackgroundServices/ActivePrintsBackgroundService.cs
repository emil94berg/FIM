using FIM.Server.Data;
using FIM.Server.Services.Interfaces;

namespace FIM.Server.BackgroundServices
{
    public class ActivePrintsBackgroundService : BackgroundService
    {

        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<NotificationBackgroundService> _logger;


        public ActivePrintsBackgroundService(IServiceScopeFactory scopeFactory, ILogger<NotificationBackgroundService> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Acitve Prints background sercvice is starting...");

            while (!cancellationToken.IsCancellationRequested)
            {
                try
                {
                    
                }
                catch (Exception ex)
                {
                    _logger.LogInformation("Error occurred in active prints background service: " + ex);
                }


                await Task.Delay(TimeSpan.FromSeconds(20), cancellationToken);
            }
        }

        private async Task UpdateProgressBarAsync()
        {
            //Byggdes i frontend istället då datan inte ändras
            using var scope = _scopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var printService = scope.ServiceProvider.GetRequiredService<IPrintService>();
        }





    }
}

using FIM.Server.Data;
using FIM.Server.Services;
using FIM.Server.Services.Interfaces;
using FIM.Server.BackgroundServices;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Supabase JWT auth
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = builder.Configuration["Supabase:Url"];
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Supabase:Url"] + "/auth/v1",
            ValidateAudience = true,
            ValidAudience = "authenticated",
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true
        };
        options.MetadataAddress = builder.Configuration["Supabase:Url"] + "/auth/v1/.well-known/openid-configuration";
        options.MapInboundClaims = false;
    });

// Add services to the container.
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:5173", "http://localhost:5092/")
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});


builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

//DI
builder.Services.AddScoped<IPrintService, PrintService>();
builder.Services.AddScoped<ISpoolService,SpoolService>();
builder.Services.AddHostedService<NotificationBackgroundService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<IPublicFilamentCatalogService, PublicFilamentCatalogService>();
builder.Services.AddScoped<IUserFavoriteFilamentService, UserFavoriteFilamentService>();
builder.Services.AddScoped<IForumPostService, ForumPostService>();

var app = builder.Build();

app.UseCors(MyAllowSpecificOrigins);

app.UseDefaultFiles();
app.MapStaticAssets();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();

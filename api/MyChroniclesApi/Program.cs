using Microsoft.EntityFrameworkCore;
using MyChroniclesApi.Services;
using Microsoft.AspNetCore.Identity;
using MyChroniclesApi.Models.Users;

var builder = WebApplication.CreateBuilder(args);
{
    builder.Services.AddControllers();
    var configuration = builder.Configuration;
    builder.Services.AddDbContext<UrlsService>(options => options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));
    builder.Services.AddDbContext<UsersService>(options => options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));
    builder.Services.AddDbContext<ChroniclesService>(options => options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));
    builder.Services.AddAuthorization();
    builder.Services.AddIdentity<User, IdentityRole>()
        .AddEntityFrameworkStores<UsersService>()
        .AddDefaultTokenProviders();
    builder.Services.AddScoped<IUrlsService, UrlsService>();
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("http://localhost:3000",
            builder => builder.WithOrigins("http://localhost:3000")
                          .AllowAnyMethod()
                          .AllowAnyHeader()
                          .AllowCredentials());
                            
        options.AddPolicy("chrome-extension",
            builder => builder.WithOrigins("chrome-extension://your-extension-id")
                          .AllowAnyMethod()
                          .AllowAnyHeader()
                          .AllowCredentials());
    });
}

var app = builder.Build();
{
    // app.UseExceptionHandler("/error");
    app.UseCors();
    app.UseHttpsRedirection();
    app.MapControllers();
    app.Run();
}


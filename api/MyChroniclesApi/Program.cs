using MyChroniclesApi.Services.Urls;
using Microsoft.EntityFrameworkCore;
using MyChroniclesApi.Services.Users;
using Microsoft.AspNetCore.Identity;
using MyChroniclesApi.Models;

var builder = WebApplication.CreateBuilder(args);
{
    builder.Services.AddControllers();
    var configuration = builder.Configuration;
    builder.Services.AddDbContext<UrlsService>(options => options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));
    builder.Services.AddDbContext<UsersService>(options => options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));
    builder.Services.AddAuthorization();
    builder.Services.AddIdentity<User, IdentityRole>()
        .AddEntityFrameworkStores<UsersService>()
        .AddDefaultTokenProviders();
    builder.Services.AddIdentityApiEndpoints<User>()
        .AddEntityFrameworkStores<UsersService>();
    builder.Services.AddScoped<IUrlsService, UrlsService>();
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowAnyOrigin",
            builder => builder.AllowAnyOrigin()
                              .AllowAnyMethod()
                              .AllowAnyHeader());
    });
}

var app = builder.Build();
{
    app.UseCors("AllowAnyOrigin");
    app.MapIdentityApi<User>();
    app.UseHttpsRedirection();
    app.MapControllers();
    app.Run();
}


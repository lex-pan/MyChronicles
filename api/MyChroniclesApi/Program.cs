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
        options.AddPolicy("allow-specific-origins",
            builder => builder.WithOrigins("http://localhost:3000", "chrome-extension://keokakefjhiabclbgfleifjbhhbamnbg")
                          .AllowAnyMethod()
                          .AllowAnyHeader()
                          .AllowCredentials());
    });

    builder.Services.ConfigureApplicationCookie(options =>
    {
        options.Cookie.SameSite = SameSiteMode.None;
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // Ensure cookies are sent only over HTTPS
    });

    builder.Services.Configure<CookiePolicyOptions>(options =>
    {
        options.OnAppendCookie = context =>
        {
            if (context.CookieOptions.Secure && context.CookieOptions.SameSite == SameSiteMode.None)
            {
                context.CookieOptions.Extensions.Add("Partitioned");
            }
        };
    });
}
// chrome-extension://keokakefjhiabclbgfleifjbhhbamnbg
var app = builder.Build();
{
    // app.UseExceptionHandler("/error");
    app.UseCookiePolicy();
    app.UseCors();
    app.UseHttpsRedirection();
    app.MapControllers();
    app.Run();
}


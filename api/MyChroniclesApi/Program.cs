using Microsoft.EntityFrameworkCore;
using MyChroniclesApi.Services;
using Microsoft.AspNetCore.Identity;
using MyChroniclesApi.Models.Users;
using MyChroniclesApi.Controllers;

var MyAllowSpecificOrigins  = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);
{
    builder.Services.AddControllers();
    var configuration = builder.Configuration;
    builder.Services.AddControllers().AddNewtonsoftJson();
    builder.Services.AddDbContext<MyChroniclesDbContext>(options => options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));
    builder.Services.AddAuthorization();
    builder.Services.AddIdentity<User, IdentityRole>()
        .AddEntityFrameworkStores<MyChroniclesDbContext>()
        .AddDefaultTokenProviders();
    builder.Services.AddScoped<IUrlsService, UrlsService>();
    builder.Services.AddScoped<UsersService>();
    builder.Services.AddScoped<ChroniclesService>();
    builder.Services.AddScoped<LogsService>();
    builder.Services.AddCors(options =>
    {
        options.AddPolicy(name: MyAllowSpecificOrigins,
            policy => 
            {
                policy.WithOrigins(
                    "http://localhost:3000", 
                    "chrome-extension://keokakefjhiabclbgfleifjbhhbamnbg", 
                    "https://my-chronicles.net", 
                    "chrome-extension://fjgebdoelpgbneakgkaoidkllobmgbmf",
                    "moz-extension://06533529-bd1d-448e-8c7f-7b27e06ef393")
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials();
            });   
    });

    builder.Services.ConfigureApplicationCookie(options =>
    {
        options.Cookie.SameSite = SameSiteMode.None;
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // Ensure cookies are sent only over HTTPS
        options.ExpireTimeSpan = TimeSpan.FromDays(365 * 100); // Set a long expiration time, essentially making it never expire
        options.SlidingExpiration = false; // Ensure the cookie doesn’t renew automatically on every request
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
    app.UseHttpsRedirection();
    app.UseCors(MyAllowSpecificOrigins);
    app.MapControllers();
    app.Run();
}


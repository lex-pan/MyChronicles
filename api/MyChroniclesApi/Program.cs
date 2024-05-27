using MyChroniclesApi.Services.Urls;

var builder = WebApplication.CreateBuilder(args);
{
    builder.Services.AddControllers();
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
    app.UseHttpsRedirection();
    app.MapControllers();
    app.Run();
}


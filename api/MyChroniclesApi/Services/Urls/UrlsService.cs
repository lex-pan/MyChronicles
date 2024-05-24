namespace MyChroniclesApi.Services.Urls;
using Npgsql;
using MyChroniclesApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

public class UrlsService : DbContext {
    protected readonly IConfiguration Configuration;

    public UrlsService(IConfiguration configuration) {
        Configuration = configuration;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder options) {
        options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection"));
    }

        // DbSet for the UrlModel
        public DbSet<DecipherUrls> chronicle_extension_decipher { get; set; }

        // Method to handle the POST command
        public async Task AddUrlAsync(DecipherUrls urlModel)
        {
            await chronicle_extension_decipher.AddAsync(urlModel);
            await SaveChangesAsync();
        }
 
}
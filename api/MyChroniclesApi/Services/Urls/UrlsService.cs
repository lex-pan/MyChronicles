namespace MyChroniclesApi.Services.Urls;
using Npgsql;
using MyChroniclesApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

public class UrlsService : DbContext, IUrlsService {
    protected readonly IConfiguration Configuration;

    public UrlsService(IConfiguration configuration) {
        Configuration = configuration;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder options) {
        options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection"));
    }

        // DbSet for the UrlModel
        public DbSet<DecipherUrls> chronicle_extension_decipher { get; set; }
        public DbSet<DecipherSteps> decipher_steps { get; set; }
        public DbSet<DOMIdentifier> identifier_info  { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)  {
            modelBuilder.Entity<DecipherUrls>()
                .HasMany(u => u.Title_start_end)
                .WithOne(s => s.DecipherUrls)
                .HasForeignKey(s => s.domain); // Assuming you have a foreign key property for TitleStartEndId in DecipherSteps

            modelBuilder.Entity<DecipherUrls>()
                .HasMany(u => u.Chapter_start_end)
                .WithOne(s => s.DecipherUrls)
                .HasForeignKey(s => s.domain); // Assuming you have a foreign key property for ChapterStartEndId in DecipherSteps

            modelBuilder.Entity<DecipherUrls>()
                .HasMany(u => u.Entertainment_category)
                .WithOne(s => s.DecipherUrls)
                .HasForeignKey(s => s.domain); // Assuming you have a foreign key property for ChapterStartEndId in DecipherSteps
        }

        // Method to handle the POST command
        public async Task AddUrlDecipher(DecipherUrls urlModel) {
            await chronicle_extension_decipher.AddAsync(urlModel);
            await SaveChangesAsync();
        }

        public async Task<DecipherUrls> GetUrlDecipher(string domain) {
            return await chronicle_extension_decipher.FirstOrDefaultAsync(u => u.Domain == domain);
        }

        public async Task<DecipherUrls> DeleteUrlDecipher(string domain) {
            var entityToDelete = await chronicle_extension_decipher.FirstOrDefaultAsync(u => u.Domain == domain);
            Console.WriteLine(entityToDelete);
            if (entityToDelete != null)
            {
                // Remove the entity from the context
                chronicle_extension_decipher.Remove(entityToDelete);
                // Save the changes to the database
                await SaveChangesAsync();
            }

            // Return the deleted entity (or null if not found)
            return entityToDelete;
        }

}
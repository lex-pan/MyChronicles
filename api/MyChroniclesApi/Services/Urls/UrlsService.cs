namespace MyChroniclesApi.Services.Urls;
using Npgsql;
using MyChroniclesApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Transactions;

public class UrlsService : DbContext, IUrlsService {
    protected readonly IConfiguration Configuration;

    public UrlsService(IConfiguration configuration) {
        Configuration = configuration;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder options) {
        options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection"));
    }

        // DbSet for the UrlModel
        public DbSet<Urls> chronicle_extension_decipher { get; set; }
        public DbSet<DecipherUrlSteps> decipher_steps { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)  {
            modelBuilder.Entity<DecipherUrlSteps>()
                .HasOne(u => u.urls)  // specifies that DecipherUrlSteps has a navigation property (Urls) that points to a single instance of Urls.
                .WithMany()  // WithMany() specifies that Urls can have many instances of DecipherUrlSteps associated with it.
                .HasForeignKey(u => u.domain); // Assuming you have a foreign key property domain in DecipherUrlSteps`    
        }

        // Method to handle the POST command
        public async Task AddUrlDecipher(Urls urlModel, List<DecipherUrlSteps> instructions) {
            using (var transaction = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled)) {
                // Add the Urls object to the DbSet
                await this.Set<Urls>().AddAsync(urlModel);

                // Add the list of DecipherUrlSteps to the DbSet
                await this.Set<DecipherUrlSteps>().AddRangeAsync(instructions);

                // Save all changes to the database
                await this.SaveChangesAsync();

                // Commit the transaction
                transaction.Complete();
            }
        }

        public async Task<Urls> GetUrlDecipher(string domain) {
            return await chronicle_extension_decipher.FirstOrDefaultAsync(u => u.Domain == domain);
        }

        public async Task<Urls> DeleteUrlDecipher(string domain) {
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
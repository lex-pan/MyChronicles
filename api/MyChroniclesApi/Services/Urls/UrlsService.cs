namespace MyChroniclesApi.Services.Urls;
using Npgsql;
using MyChroniclesApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Transactions;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

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

        public async Task<UrlsResult> GetUrlDecipher(string domain) {
            string domain_query_string = "SELECT * FROM chronicle_extension_decipher WHERE domain = {0}";
            string steps_query_string = "SELECT * FROM decipher_steps WHERE domain = {0}";
            var steps = await this.decipher_steps.FromSqlRaw(steps_query_string, domain)
            .ToListAsync();
            var domain_query = await this.chronicle_extension_decipher.FromSqlRaw(domain_query_string, domain).FirstOrDefaultAsync();
            UrlsResult query_result = new UrlsResult(domain_query, steps);
            return query_result;
        }

        public async Task<Urls> DeleteUrlDecipher(string domain) {
            var entityToDelete = await chronicle_extension_decipher.FirstOrDefaultAsync(u => u.domain == domain);

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
        
        public async Task UpdateUrlDecipher(Urls urlModel, List<DecipherUrlSteps> instructions) {
                await DeleteUrlDecipher(urlModel.domain);
                await AddUrlDecipher(urlModel, instructions);
        }
        
}
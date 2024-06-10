namespace MyChroniclesApi.Services.Urls;
using MyChroniclesApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Transactions;
using MyChroniclesApi.ServiceErrors;

public class UrlsService : DbContext, IUrlsService {
    public UrlsService(DbContextOptions<UrlsService> options) : base(options) {
        
    }

    // DbSets are an entry point to a table within a database that allows you to perform crud operations
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
    public async Task<ErrorOr<string>> AddUrlDecipher(Urls urlModel, List<DecipherUrlSteps> instructions) {

        try {
        // For code within the transaction scope, it ensures that all code will be committed or no code will be committed. Atomicity 
        // TransactionScopeAsyncFlowOption.Enabled 
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

            return ErrorOr<string>.Success("post request was successful");
        } catch (Exception) {
            Error domainExists = Error.InvalidInput(
                urlModel.domain,
                "domain already exists in Database"
            );

            return ErrorOr<string>.Failure(domainExists);
        }
    }

    public async Task<ErrorOr<UrlsResult>> GetUrlDecipher(string domain) {
        string domain_query_string = "SELECT * FROM chronicle_extension_decipher WHERE domain = {0}";
        string steps_query_string = "SELECT * FROM decipher_steps WHERE domain = {0} ORDER BY step_number";
        var steps = await this.decipher_steps.FromSqlRaw(steps_query_string, domain)
        .ToListAsync();
        var domain_query = await this.chronicle_extension_decipher.FromSqlRaw(domain_query_string, domain).FirstOrDefaultAsync();
        UrlsResult urlsResult = new UrlsResult();
        ErrorOr<UrlsResult> query_result = urlsResult.Create(domain_query, steps);
        return query_result;
    }

    public async Task<ErrorOr<string>> DeleteUrlDecipher(string domain) {
        var entityToDelete = await chronicle_extension_decipher.FirstOrDefaultAsync(u => u.domain == domain);

        if (entityToDelete != null)
        {
            // Remove the entity from the context
            chronicle_extension_decipher.Remove(entityToDelete);
            // Save the changes to the database
            await SaveChangesAsync();
        }

        // Return the deleted entity (or null if not found)
        return ErrorOr<string>.Success("successfully deleted");
    }
    
    public async Task<ErrorOr<string>> UpdateUrlDecipher(Urls urlModel, List<DecipherUrlSteps> instructions) {
        await DeleteUrlDecipher(urlModel.domain);
        return await AddUrlDecipher(urlModel, instructions);
    }       
}
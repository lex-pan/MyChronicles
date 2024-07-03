namespace MyChroniclesApi.Services;
using MyChroniclesApi.Models.Urls;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Transactions;
using MyChroniclesApi.ServiceErrors;

public class UrlsService : MyChroniclesDbContext, IUrlsService {
    public UrlsService(DbContextOptions<MyChroniclesDbContext> options) : base(options) {
        
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
        string steps_query_string = "SELECT * FROM decipher_steps WHERE domain = {0} ORDER BY step_number";
        var steps = await this.Set<DecipherUrlSteps>()
            .Where(s => s.domain == domain)
            .OrderBy(s => s.step_number)
            .ToListAsync();
        var domain_query = await this.Set<Urls>().FindAsync(domain);
        UrlsResult urlsResult = new UrlsResult();
        ErrorOr<UrlsResult> query_result = urlsResult.Create(domain_query, steps);
        return query_result;
    }

    public async Task<ErrorOr<string>> DeleteUrlDecipher(string domain) {
        var entityToDelete = await Set<Urls>().FirstOrDefaultAsync(u => u.domain == domain);

        if (entityToDelete != null)
        {
            // Remove the entity from the context
            Set<Urls>().Remove(entityToDelete);
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
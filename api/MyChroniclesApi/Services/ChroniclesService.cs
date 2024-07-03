namespace MyChroniclesApi.Services;
using MyChroniclesApi.Models.Chronicles;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Transactions;
using MyChroniclesApi.ServiceErrors;
using Microsoft.Extensions.ObjectPool;

public class ChroniclesService : MyChroniclesDbContext {
    public ChroniclesService(DbContextOptions<MyChroniclesDbContext> options) : base(options) {
        
    }

    public async Task<ErrorOr<AlternativeTitles>> existingChronicle(string title, string entertainment_category) {
        var existingTitle = await this.Set<AlternativeTitles>().FirstOrDefaultAsync(alt_title => alt_title.alternative_title == title && alt_title.entertainment_category == entertainment_category);
        
        if (existingTitle is null) {
            return ErrorOr<AlternativeTitles>.Failure(Error.NotFound("", "alternative title does not exist"));
        } else {
            return ErrorOr<AlternativeTitles>.Success(existingTitle);
        }
    }   

    public async Task<ErrorOr<string>> addChronicle(Chronicles chronicle) {
        try {
            await this.Set<Chronicles>().AddAsync(chronicle);   
            await this.SaveChangesAsync();
            return ErrorOr<string>.Success("chronicle successfully added");
        } catch {
            return ErrorOr<string>.Failure(Error.InternalServerError("", "something went wrong with the server"));
        }
    }

    public async Task<ErrorOr<Guid>> matchUrls(string url) {
        try {
            ChronicleUrlMatch alt_title = await this.Set<ChronicleUrlMatch>().FindAsync(url);

            if (alt_title is null) {
                return ErrorOr<Guid>.Failure(Error.NotFound("", "no matching url found"));
            } else {
                return ErrorOr<Guid>.Success(alt_title.chronicle_id);
            }
        } catch {
            return ErrorOr<Guid>.Failure(Error.InternalServerError("", "Internal Server Error"));
        }
    }

    /*
            Guid? chronicleId = _chronicles.existingChronicle(info.title);

        if (chronicleId is null) {
            // create a model that accepts a chronicle with only the name
            var newChronicle = new Chronicles(
                info.title
            );
            
            // should add a chronicle and return chronicle id
            chronicleId = _chronicles.addChronicle(newChronicle);
        }
    */       
}
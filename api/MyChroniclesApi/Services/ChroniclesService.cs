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

    public async Task<ErrorOr<AlternativeTitles>> existingChronicleByTitle(string title, string entertainment_category) {
        var existingTitle = await this.Set<AlternativeTitles>().FirstOrDefaultAsync(alt_title => alt_title.alternative_title == title && alt_title.entertainment_category == entertainment_category);
        
        if (existingTitle is null) {
            return ErrorOr<AlternativeTitles>.Failure(Error.NotFound("", "alternative title does not exist"));
        } else {
            return ErrorOr<AlternativeTitles>.Success(existingTitle);
        }
    }   

    public async Task<ErrorOr<string>> addChronicle(Chronicles chronicle, AlternativeTitles alt_chronicle) {
        try {
            await this.Set<Chronicles>().AddAsync(chronicle);   
            await this.Set<AlternativeTitles>().AddAsync(alt_chronicle);
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

    //     public QueriedChronicle(string BookID, string BookTitle, string EntertainmentCategory, int Year) {

    public async Task<ErrorOr<List<QueriedChronicle>>> queryChroniclesByString(string queryString) {
        List<QueriedChronicle> entities = await this.Set<AlternativeTitles>()
            .Where(e => e.alternative_title.ToLower().Contains(queryString.ToLower()))
            .Take(30)
            .Select(e => new QueriedChronicle(e.chronicles.chronicle_id, e.alternative_title, e.entertainment_category, e.chronicles.start_date, e.chronicles.country , e.chronicles.author))
            .ToListAsync();

        return ErrorOr<List<QueriedChronicle>>.Success(entities);
    }

    public async Task<ErrorOr<List<DetailedQueriedChronicle>>> queryChroniclesByStringDetailed(string queryString, int pageNumber) {
        List<DetailedQueriedChronicle> entities = await this.Set<AlternativeTitles>()
            .Where(e => e.alternative_title.ToLower().Contains(queryString.ToLower()))
            .Skip(pageNumber * 50)
            .Take(50)
            .Select(e => new DetailedQueriedChronicle(
                e.chronicles.chronicle_id, 
                e.alternative_title, 
                e.entertainment_category, 
                e.chronicles.status, 
                e.chronicles.country , 
                e.chronicles.author, 
                e.chronicles.rating, 
                e.chronicles.members,
                e.chronicles.episodes,
                e.chronicles.synopsis
                ))
            .ToListAsync();
            
        return ErrorOr<List<DetailedQueriedChronicle>>.Success(entities);
    }

    public async Task<ErrorOr<bool>> existingChronicleById(Guid chronicleID) {
        var chronicleExists = await this.Set<Chronicles>().FindAsync(chronicleID);
        
        if (chronicleExists is null) {
            return ErrorOr<bool>.Success(false);
        } else {
            return ErrorOr<bool>.Success(true);
        }
    }

    public async Task<ErrorOr<AllChronicleInfo>> retrieveAdditionalChronicleInfo(Guid ChronicleID) {
        var chronicleExists = await this.Set<Chronicles>().FindAsync(ChronicleID);
        
        if (chronicleExists is null) {
            return ErrorOr<AllChronicleInfo>.Failure(Error.NotFound("", "chronicle with this id does not exist"));
        } else {
            List<string> genres = await this.Set<ChroniclesTag>()
                .Where(e => e.chronicle_id == ChronicleID)
                .Select(e => e.tag)
                .ToListAsync();

            List<string> tags = await this.Set<ChroniclesGenre>()
                .Where(e => e.chronicle_id == ChronicleID)
                .Select(e => e.genre)
                .ToListAsync();
            
            List<string> alternative_titles = await this.Set<AlternativeTitles>()
                .Where(e => e.chronicle_id == ChronicleID)
                .Select(e => e.alternative_title)
                .ToListAsync();
            
            List<string> chronicle_reviews = await this.Set<ChroniclesReview>()
                .Where(e => e.chronicle_id == ChronicleID)
                .Select(e => e.review)
                .ToListAsync();

            AllChronicleInfo all = new AllChronicleInfo(
                chronicleExists.chronicle_id,
                chronicleExists.title,
                chronicleExists.entertainment_category,
                chronicleExists.status,
                chronicleExists.country,
                chronicleExists.author,
                chronicleExists.rating,
                chronicleExists.members,
                chronicleExists.episodes,
                chronicleExists.synopsis,
                genres,
                tags,
                alternative_titles
            );

            return ErrorOr<AllChronicleInfo>.Success(all);
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
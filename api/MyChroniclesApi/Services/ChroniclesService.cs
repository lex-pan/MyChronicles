namespace MyChroniclesApi.Services;
using MyChroniclesApi.Models.Chronicles;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Transactions;
using MyChroniclesApi.ServiceErrors;
using Microsoft.Extensions.ObjectPool;
using MyChroniclesApi.Models.Users;
using MyChroniclesApi.Contracts.Chronicles;

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
            var matching_title_entries = await this.Set<AlternativeTitles>()
                .Where(c => c.alternative_title == alt_chronicle.alternative_title)
                .ToListAsync();

            foreach(var entry in matching_title_entries) {
                entry.isUnique = false;
            }

            if (matching_title_entries.Count > 0) {
                alt_chronicle.isUnique = false;
            }

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
            List<string> alternative_titles = await this.Set<AlternativeTitles>()
                .Where(e => e.chronicle_id == ChronicleID)
                .Select(e => e.alternative_title)
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
                chronicleExists.length,
                chronicleExists.start_date,
                chronicleExists.end_date,
                chronicleExists.genres,
                chronicleExists.tags,
                alternative_titles
            );

            return ErrorOr<AllChronicleInfo>.Success(all);
        }

    }
    
    public async Task<ErrorOr<ChronicleSearchPage>> retrieveChronicleReviewsById(Guid chronicleId, string userId) {

        //  var chronicleExists = await this.Set<Chronicles>().FindAsync(ChronicleID);
        var chronicleReviews = await this.Set<UserChronicles>()
            .Where(e => e.book_id == chronicleId && e.review != "" && e.review != null)
            .Take(30)
            .Select(e => new ChroniclesReview(
                e.review,
                e.users.UserName,
                e.rating,
                e.episode,
                e.review_date
            ))
            .ToListAsync();

        if (userId != null) {
            var userReview = await this.Set<UserChronicles>()
                .Where(uc => uc.book_id == chronicleId && uc.user_id == userId)
                .Select(uc => new ChroniclesReview(
                    uc.review,
                    uc.users.UserName,
                    uc.rating,
                    uc.episode,
                    uc.review_date
                ))
                .FirstOrDefaultAsync();
                
            return ErrorOr<ChronicleSearchPage>.Success(new ChronicleSearchPage(chronicleReviews, UserReview: userReview));
        }
    
        return ErrorOr<ChronicleSearchPage>.Success(new ChronicleSearchPage(chronicleReviews, null));
    }
    
    // possible non-edit values is empty string, null, or empty list
    
    public async Task<ErrorOr<string>> updateChronicleManually(ChronicleContractEdit chronicleEdits) {
        // retrieve the chronicle to change it to valid points
        Guid chronicleID;
        bool validID = Guid.TryParse(chronicleEdits.chronicle_id, out chronicleID);

        if (!validID) {
            return ErrorOr<string>.Failure(Error.InvalidInput("", "invalid guid"));
        }

        Chronicles updatingChronicle = await this.Set<Chronicles>().FindAsync(chronicleID);

        if (updatingChronicle != null) {
            var propertyOfChronicles = updatingChronicle.GetType().GetProperties();

            foreach (var propertyOfEdits in chronicleEdits.GetType().GetProperties()) {
                // check if edit property is also a property in chronicles 
                // and if it exists retrieve the property(returns name and value)
                var editPropInChronicles = propertyOfChronicles.FirstOrDefault(p => p.Name == propertyOfEdits.Name);

                // if the property we're editting is in the chronicles table we edit that
                // otherwise we're edtting the tables that point to the chronicles table
                if (editPropInChronicles != null && editPropInChronicles.Name != "chronicle_id") {
                    if (propertyOfEdits.Name == "end_date" || propertyOfEdits.Name == "start_date") {
                        if (propertyOfEdits.GetValue(chronicleEdits, null) == "") {
                            editPropInChronicles.SetValue(updatingChronicle, new DateTime(1, 1, 1));
                        } else {
                            DateTime castValue = DateTime.Parse(propertyOfEdits.GetValue(chronicleEdits, null).ToString()).ToUniversalTime();
                            editPropInChronicles.SetValue(updatingChronicle, castValue);
                        }
                    } else {
                        if (propertyOfEdits.GetValue(chronicleEdits, null) is null) {
                            editPropInChronicles.SetValue(updatingChronicle, null);
                        } else {
                            editPropInChronicles.SetValue(updatingChronicle, propertyOfEdits.GetValue(chronicleEdits, null));
                        }
                    }
                } else {
                    if (propertyOfEdits.Name == "other_creators") {
                        // creator should already exist
                        // if not, return null
                    }

                    if (propertyOfEdits.Name == "alt_titles") {
                        List<string> new_titles = chronicleEdits.alt_titles;
                        // make sure that new titles at least contains the main chronicle title
                        var primary_title = new_titles.FirstOrDefault(title => title == updatingChronicle.title);

                        if (primary_title is null) {
                            return ErrorOr<string>.Failure(Error.InvalidInput("", "original title must exist"));
                        } else {
                            List<AlternativeTitles> existing_alt_titles = await this.Set<AlternativeTitles>()
                                .Where(a => a.chronicle_id == updatingChronicle.chronicle_id)
                                .ToListAsync();

                            for (int i =0; i < new_titles.Count; i++) {
                                var matching_title = existing_alt_titles.FirstOrDefault(e => e.alternative_title == new_titles[i]);

                                if (matching_title is null) {
                                    // check if other chronicles have the same alt title
                                    var other_titles = await this.Set<AlternativeTitles>()
                                        .Where(a => a.alternative_title == new_titles[i])
                                        .ToListAsync();

                                    AlternativeTitles newTitle = new AlternativeTitles(
                                        new_titles[i],
                                        updatingChronicle.chronicle_id,
                                        false,
                                        updatingChronicle.entertainment_category
                                    );

                                    if (other_titles is null) {
                                        newTitle.isUnique = true;
                                    } else {
                                        for (int a = 0; a < other_titles.Count; a++) {
                                            other_titles[a].isUnique = false;
                                        }
                                    }

                                    await this.Set<AlternativeTitles>().AddAsync(newTitle);
                                } else {
                                    existing_alt_titles.Remove(matching_title);
                                }  
                            }

                            this.Set<AlternativeTitles>().RemoveRange(existing_alt_titles);
                        }
                             
                    }
                        
                }
            }

            await this.SaveChangesAsync();
            return ErrorOr<string>.Success("successfully editted");
        } else {
            return ErrorOr<string>.Failure(Error.InvalidInput("", "chronicle does not exist"));
        } 
            
    }            
} 
    
    /*
    check if other_creator already exists, if so map it to that guy 
    List<string> other_creators, (should already be existing, so if it doesn't exist return an error)
    List<string> alt_titles (if it doesn't exist create one, if it does check if it maps to the current chronicle, if it doesn't mark current as non-unique and create new one mapping)
    */

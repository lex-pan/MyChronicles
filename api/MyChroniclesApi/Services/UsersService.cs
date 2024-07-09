namespace MyChroniclesApi.Services;
using Npgsql;
using MyChroniclesApi.Services;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using MyChroniclesApi.Models.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Transactions;
using MyChroniclesApi.ServiceErrors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Reflection;

public class UsersService : MyChroniclesDbContext {
    public UsersService(DbContextOptions<MyChroniclesDbContext> options) : base(options) {
        
    }

    public async Task<ErrorOr<string>> addUserHistory(UserHistory history) {
        try {
            await this.Set<UserHistory>().AddAsync(history);
            await this.SaveChangesAsync();
            return ErrorOr<string>.Success("userHistory added");
        } catch {
            return ErrorOr<string>.Failure(Error.InternalServerError("", "internal server error"));
        }
    }

    public async Task<ErrorOr<UserChronicles>> updateAutomaticUserchronicle(UserChronicles automaticUC) {
        try {
            // find if the user chronicle first exists
            // if it does, update
            // otherwise insert the new one
            var userChronicleExists = await this.Set<UserChronicles>().FindAsync(automaticUC.user_id, automaticUC.book_id);

            if (userChronicleExists is null) {
                await this.Set<UserChronicles>().AddAsync(automaticUC);
                await this.SaveChangesAsync();
                return ErrorOr<UserChronicles>.Success(automaticUC);
            } else {
                userChronicleExists.episode = automaticUC.episode;
                userChronicleExists.last_read = DateTime.UtcNow;
                await this.SaveChangesAsync();
                return ErrorOr<UserChronicles>.Success(userChronicleExists);

            }

        } catch {
            return ErrorOr<UserChronicles>.Failure(Error.InternalServerError("", "internal server error"));
        }
    }

    // goes through each chronicle by finding the chronicle in db by combining user id and book id
    // for each chronicle, check the attributes it has and if it does, change the current one
    public async Task<ErrorOr<string>> updateFlexibleUserChronicles(Dictionary<Guid, UCChange> chroniclesToUpdate, string userId) {
        try {
            foreach (KeyValuePair<Guid, UCChange> chronicle in chroniclesToUpdate) {
                // search user chronicle based on user id and book id
                // change attributes 
                UCChange propertiesToChange = chronicle.Value;

                UserChronicles matchingChronicle = await this.Set<UserChronicles>().FindAsync(userId, chronicle.Key);

                if (matchingChronicle is null) {
                    return ErrorOr<string>.Failure(Error.InvalidInput("","no user with this chronicle was found"));
                } else {
                    PropertyInfo[] userChronicleAttributes = typeof(UCChange).GetProperties();
                    foreach (PropertyInfo attribute in userChronicleAttributes) {
                        if (attribute.Name != "user_id" && attribute.GetValue(propertiesToChange) != null) {
                            
                            typeof(UserChronicles).GetProperty(attribute.Name).SetValue(matchingChronicle, attribute.GetValue(propertiesToChange));
                        }
                    }

                    await this.SaveChangesAsync();
                }
            }

            return ErrorOr<string>.Success("all successfully modified");
        } catch {
            return ErrorOr<string>.Failure(Error.InternalServerError("", "internal server error"));
        }
    }

    public async Task<ErrorOr<List<RetrievedUserChronicle>>> retrieveUCByName(string userID) {
        try {
            List<RetrievedUserChronicle> retrievedUserChronicles = await this.Set<UserChronicles>()
            .Where(uc => uc.user_id == userID)
            .Select(uc => new RetrievedUserChronicle(
                uc.chronicles.title,
                uc.book_id,
                uc.episode,
                uc.status,
                uc.rating,
                uc.last_read,
                uc.entertainment_category
            ))
            .ToListAsync();

            return ErrorOr<List<RetrievedUserChronicle>>.Success(retrievedUserChronicles);
        } catch {
            return ErrorOr<List<RetrievedUserChronicle>>.Failure(Error.InternalServerError("", "internal server error"));
        }
        
    }

    public async Task<ErrorOr<UCAdditonal>> retrieveUCAdditional(string user_id, Guid book_id) {
        var userChronicleExists = await this.Set<UserChronicles>().FindAsync(user_id, book_id);

        if (userChronicleExists is null) {
            return ErrorOr<UCAdditonal>.Failure(Error.NotFound("", "User Chronicle does not exist"));
        } else {
            UCAdditonal additional_info = new UCAdditonal(
                Review: userChronicleExists.review,
                StartDate: userChronicleExists.start_date,
                Notes: userChronicleExists.notes
            );
            return ErrorOr<UCAdditonal>.Success(additional_info);
        }
    }
}
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
using System.Diagnostics;
using MyChroniclesApi.Models.Chronicles;

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
        foreach (KeyValuePair<Guid, UCChange> chronicle in chroniclesToUpdate) {
            // search user chronicle based on user id and book id
            // change attributes 
            UCChange propertiesToChange = chronicle.Value;

            UserChronicles matchingUserChronicle = await this.Set<UserChronicles>().FindAsync(userId, chronicle.Key);

            if (matchingUserChronicle is null) {
                Chronicles foundChronicle = await this.Set<Chronicles>().FindAsync(chronicle.Key);

                if (foundChronicle == null || foundChronicle.entertainment_category == null) {
                    return ErrorOr<string>.Failure(Error.NotFound("", "chronicle somehow not found gg's"));
                }

                UserChronicles newUC = new UserChronicles(
                    UserId: userId,
                    BookID: chronicle.Key,
                    Episode: propertiesToChange.episode,
                    EntertainmentCategory: foundChronicle.entertainment_category                    
                );

                PropertyInfo[] UCchangeAttributes = typeof(UCChange).GetProperties();

                foreach (PropertyInfo attribute in UCchangeAttributes) {
                    PropertyInfo UCattribute = typeof(UserChronicles).GetProperty(attribute.Name);
                    if (UCattribute != null && attribute.GetValue(propertiesToChange) != null)  {
                        typeof(UserChronicles).GetProperty(attribute.Name).SetValue(newUC, attribute.GetValue(propertiesToChange));
                    }
                }

                await this.Set<UserChronicles>().AddAsync(newUC);
                await this.SaveChangesAsync();    

            } else {
                PropertyInfo[] UCchangeAttributes = typeof(UCChange).GetProperties();

                foreach (PropertyInfo attribute in UCchangeAttributes) {
                    PropertyInfo UCattribute = typeof(UserChronicles).GetProperty(attribute.Name);
                    if (UCattribute != null && attribute.GetValue(propertiesToChange) != null)  {
                        typeof(UserChronicles).GetProperty(attribute.Name).SetValue(matchingUserChronicle, attribute.GetValue(propertiesToChange));
                    }
                }

                await this.SaveChangesAsync();
            }
        }

        return ErrorOr<string>.Success("all successfully modified");
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

    public async Task<ErrorOr<RetrievedUserProfile>> retrieveUserProfile(string userID) {
        try {
            var retrieveUserInformation = await this.Set<User>().FindAsync(userID);
            List<UserProfileHistory> retrieveUserProfileHistory = await this.Set<UserHistory>()
                .Where(e => e.user_id == userID)
                .OrderByDescending(e => e.date_of_action)
                .Select(e => new UserProfileHistory(e.title, e.action, e.date_of_action, e.chapter))
                .Take(6)
                .ToListAsync();
            
            RetrievedUserProfile profileData = new RetrievedUserProfile(
                retrieveUserInformation.last_online,
                retrieveUserInformation.account_creation_time,
                retrieveUserInformation.num_watched_read,
                retrieveUserInformation.avg_rating,
                retrieveUserInformation.bio,
                retrieveUserProfileHistory
            );

            return ErrorOr<RetrievedUserProfile>.Success(profileData);
        } catch {
            return ErrorOr<RetrievedUserProfile>.Failure(Error.InternalServerError("", "error retrieving items"));
        }

    }

    public async Task<ErrorOr<string>> updateBio(string userID, string updatedBio) {
        try {
            var user = await this.Set<User>().FindAsync(userID);

            if (user != null) {
                user.bio = updatedBio;
                await this.SaveChangesAsync(); // Save changes asynchronously

                return ErrorOr<string>.Success("successfully updated bio");
            } else {
                return ErrorOr<string>.Failure(Error.InternalServerError("", "Error finding user"));
            }
        } catch {
            return ErrorOr<string>.Failure(Error.InternalServerError("", "something went wrong with the server"));
        }    
    }

    public async Task<ErrorOr<string>> deleteChronicle(string userID, Guid  chronicleID) {
        UserChronicles UCtoDelete = await this.Set<UserChronicles>().FindAsync(userID, chronicleID);

        if (UCtoDelete == null) {
            return ErrorOr<string>.Success("User never had this chronicle in their library");
        }

        this.Set<UserChronicles>().Remove(UCtoDelete);
        await this.SaveChangesAsync();

        return ErrorOr<string>.Success("sucessfully removed");
    }

    public async Task<ErrorOr<List<RetrievedUserHistory>>> retrieveHistoryByUserID(string user_id, int page_number) {
        List<RetrievedUserHistory> recentUserHistory = await this.Set<UserHistory>()
            .Where(e => e.user_id == user_id)
            .OrderByDescending(e => e.date_of_action) // Order by date in descending order for most recent entries
            .Skip(page_number * 100)
            .Take(100)
            .Select(e => new RetrievedUserHistory(e.title, e.chapter, e.action, e.url, e.date_of_action))
            .ToListAsync();
        
        return ErrorOr<List<RetrievedUserHistory>>.Success(recentUserHistory);
    }
}
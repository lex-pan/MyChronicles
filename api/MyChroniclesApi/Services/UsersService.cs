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
            } else {
                userChronicleExists.episode = automaticUC.episode;
                userChronicleExists.last_read = DateTime.UtcNow;
            }

            await this.SaveChangesAsync();
            return ErrorOr<UserChronicles>.Success(userChronicleExists);

        } catch {
            return ErrorOr<UserChronicles>.Failure(Error.InternalServerError("", "internal server error"));
        }
    }
}
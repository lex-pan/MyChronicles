namespace MyChroniclesApi.Services.Users;
using Npgsql;
using MyChroniclesApi.Services.Users;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using MyChroniclesApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Transactions;
using MyChroniclesApi.ServiceErrors;
using Microsoft.AspNetCore.Identity;

public class UsersService : IdentityDbContext<User> {
    public DbSet<UserHistory> user_history { get; set; }
    public DbSet<UserChronicles> user_chronicles { get; set; }
    public UsersService(DbContextOptions<UsersService> options) : base(options) {

    }
    
}
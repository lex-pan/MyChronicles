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

public class UsersService : IdentityDbContext<User> {
    public DbSet<UserHistory> user_history { get; set; }
    public DbSet<UserChronicles> user_chronicles { get; set; }
    public DbSet<User> User { get; set; }
    public UsersService(DbContextOptions<UsersService> options) : base(options) {

    }

    // add relationship between chronicle and user for user_chronicles, add relationship between user_history and user 
    protected override void OnModelCreating(ModelBuilder modelBuilder)  {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<UserChronicles>()
            .HasOne(u => u.chronicles)  
            .WithMany()  
            .HasForeignKey(u => u.book_id);

        modelBuilder.Entity<UserChronicles>()
            .HasOne(u => u.users)  
            .WithMany()  
            .HasForeignKey(u => u.user_id); 
        
        modelBuilder.Entity<UserHistory>()
            .HasOne(u => u.users)  
            .WithMany()  
            .HasForeignKey(u => u.user_id);
    }
}
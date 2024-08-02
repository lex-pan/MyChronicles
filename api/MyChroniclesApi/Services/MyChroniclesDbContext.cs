namespace MyChroniclesApi.Services;
using MyChroniclesApi.Models.Chronicles;
using MyChroniclesApi.Models.Users;
using MyChroniclesApi.Models.Urls;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

public class MyChroniclesDbContext : IdentityDbContext<User>
{
    public MyChroniclesDbContext(DbContextOptions<MyChroniclesDbContext> options) : base(options)
    {
    }

    // DbSets from UrlsService
    public DbSet<Urls> Urls { get; set; }
    public DbSet<DecipherUrlSteps> DecipherUrlSteps { get; set; }
    // Add other DbSet properties from UrlsService as needed

    // DbSets from UsersService
    public DbSet<User> Users { get; set; }
    public DbSet<UserChronicles> UserChronicles { get; set; }
    public DbSet<UserHistory> UserHistory { get; set; }

    // Add other DbSet properties from UsersService as needed

    // DbSets from ChroniclesService
    public DbSet<Chronicles> Chronicles { get; set; }
    public DbSet<AlternativeTitles> AlternativeTitles { get; set; }
    public DbSet<Character> Characters { get; set; }
    public DbSet<ChroniclesCast> ChroniclesCast { get; set; }
    public DbSet<ChroniclesGenre> ChroniclesGenres { get; set; }
    public DbSet<ChroniclesTag> ChroniclesTags { get; set; }
    public DbSet<ChronicleUrlMatch> ChronicleUrlMatch { get; set; }
    // Add other DbSet properties from ChroniclesService as needed

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<DecipherUrlSteps>()
            .HasOne(u => u.urls)  // specifies that DecipherUrlSteps has a navigation property (Urls) that points to a single instance of Urls.
            .WithMany()  // WithMany() specifies that Urls can have many instances of DecipherUrlSteps associated with it.
            .HasForeignKey(u => u.domain); // Assuming you have a foreign key property domain in DecipherUrlSteps`that allows you to identify the url in decipher steps
        
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

        modelBuilder.Entity<UserChronicles>()
            .HasKey(uc => new { uc.user_id , uc.book_id });

        modelBuilder.Entity<AlternativeTitles>()
            .HasOne(u => u.chronicles)  
            .WithMany()  
            .HasForeignKey(u => u.chronicle_id); 

        modelBuilder.Entity<ChronicleUrlMatch>()
            .HasOne(u => u.chronicles)  
            .WithMany()  
            .HasForeignKey(u => u.chronicle_id); 
        
        modelBuilder.Entity<ChroniclesGenre>()
            .HasOne(u => u.chronicles) 
            .WithMany()  
            .HasForeignKey(u => u.chronicle_id);   
        
        modelBuilder.Entity<ChroniclesGenre>()
            .HasKey(cg => new { cg.chronicle_id, cg.genre });
        
        modelBuilder.Entity<ChroniclesTag>()
            .HasOne(u => u.chronicles)  
            .WithMany()  
            .HasForeignKey(u => u.chronicle_id);
        
        modelBuilder.Entity<ChroniclesTag>()
            .HasKey(cg => new { cg.chronicle_id, cg.tag });

        modelBuilder.Entity<ChroniclesCast>()
            .HasOne(u => u.chronicles)  
            .WithMany()  
            .HasForeignKey(u => u.chronicle_id); 
        
        modelBuilder.Entity<ChroniclesCast>()
            .HasOne(u => u.characters)  
            .WithMany()  
            .HasForeignKey(u => u.character_id); 

        modelBuilder.Entity<ChroniclesCast>()
            .HasKey(cg => new { cg.chronicle_id, cg.character_id });
    }
}
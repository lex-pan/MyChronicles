namespace MyChroniclesApi.Services;
using MyChroniclesApi.Models.Chronicles;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Transactions;
using MyChroniclesApi.ServiceErrors;

public class ChroniclesService : DbContext {
    public ChroniclesService(DbContextOptions<ChroniclesService> options) : base(options) {
        
    }

    // DbSets are an entry point to a table within a database that allows you to perform crud operations
    // DbSet for the UrlModel
    public DbSet<AlternativeTitles> alternative_titles { get; set; }
    public DbSet<Character> character { get; set; }
    public DbSet<Chronicles> chronicles { get; set; }
    public DbSet<ChroniclesCast> chronicles_cast { get; set; }
    public DbSet<ChroniclesGenre> chronicles_genre { get; set; }
    public DbSet<ChroniclesTag> chronicles_tag { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)  {
        modelBuilder.Entity<AlternativeTitles>()
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
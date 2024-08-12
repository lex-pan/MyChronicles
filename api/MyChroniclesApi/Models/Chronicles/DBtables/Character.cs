namespace MyChroniclesApi.Models.Chronicles;
using System.ComponentModel.DataAnnotations;

public class Character {
    [Key]
    public Guid id { get; set; } 
    public string name { get; set; }
    public int? age { get; set; }
    public string? gender { get; set; }
    public string? background { get; set; }
    public string? appearance { get; set; }
    public string? personality { get; set; }
    public string? abilities { get; set; }
    public string? social_connections { get; set; }
    public string? about {get; set; } 

    public Character() {}

    public Character(
            string Name, 
            int Age, 
            string Gender, 
            string Background, 
            string Appearance, 
            string Personality, 
            string Abilities, 
            string SocialConnections, 
            string About )
    {
        id = Guid.NewGuid();
        name = Name;
        age = Age;
        gender = Gender;
        background = Background;
        appearance = Appearance;
        personality = Personality;
        abilities = Abilities;
        social_connections = SocialConnections;
        about = About;
    }
    
}
namespace MyChroniclesApi.Models.Chronicles;
using System.ComponentModel.DataAnnotations;

public class Chronicles {
    [Key]
    public Guid chronicle_id { get; set; }
    public string title { get; set; }
    public string? author { get; set; }
    public string? entertainment_category { get; set; }
    public int? episodes { get; set; }
    public int? length { get; set; }
    public DateTime? creation_date { get; set; }
    public string? language { get; set; }
    public string? country { get; set; }
    public DateTime db_add_date { get; set; }

    public Chronicles() {}

    public Chronicles(
            string Title, 
            string Author, 
            string EntertainmentCategory, 
            int Episodes, 
            int Length, 
            DateTime CreationDate, 
            string Language, 
            string Country) 
    {
        chronicle_id = Guid.NewGuid();
        title = Title;
        author = Author;
        entertainment_category = EntertainmentCategory;
        episodes = Episodes;
        length = Length;
        creation_date = CreationDate;
        language = Language;
        country = Country;
        db_add_date = DateTime.UtcNow;
    }
}
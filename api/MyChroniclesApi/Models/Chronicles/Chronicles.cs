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
    public int? members { get; set; }
    public int? rating { get; set; }
    public string? status { get; set; }
    public DateTime? start_date { get; set; }
    public DateTime? end_date { get; set; }
    public string? synopsis { get; set; }
    public DateTime? db_add_date { get; set; }

    public Chronicles() {}

    public Chronicles(
            string Title, 
            string Author, 
            string EntertainmentCategory, 
            int Episodes, 
            int Length, 
            DateTime CreationDate, 
            string Language, 
            string Country,
            int Members,
            int Rating,
            string Status,
            DateTime Started,
            DateTime Ended,
            string Synopsis    
        ) 
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
        members = Members;
        rating = Rating;
        status = Status;
        start_date = Started;
        end_date = Ended;
    }
}
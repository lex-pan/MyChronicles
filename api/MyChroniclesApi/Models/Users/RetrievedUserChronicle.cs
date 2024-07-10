namespace MyChroniclesApi.Models.Users;

public class RetrievedUserChronicle {
    public string book_name { get; set; }
    public Guid book_id { get; set; } 
    public float? episode { get; set; }
    public string? status { get; set; }
    public float? rating { get; set; }
    public DateTime? last_read { get; set; }
    public string entertainment_category { get; set; }

    public RetrievedUserChronicle(
        string BookName,
        Guid BookID,
        float? Episode,
        string? Status,
        float? Rating,
        DateTime? LastRead,
        string EntertainmentCategory
    ) 
    {
        book_name = BookName;
        book_id = BookID;
        episode = Episode;
        status = Status;
        rating = Rating;
        last_read = LastRead;
        entertainment_category = EntertainmentCategory;
    }
}
namespace MyChroniclesApi.Models.Users;
public class UCChange {
    public int? episode { get; set; }
    public string? status { get; set; }
    public float? rating { get; set; }
    public string? review { get; set; }
    public DateTime? start_date { get; set; }
    public DateTime? end_date { get; set; }
    public string? notes { get; set; }
    public UCChange(
        int? Episode = null,
        string? Status = null,
        float? Rating = null,
        string? Review = null,
        DateTime? StartDate = null,
        DateTime? EndDate = null,
        string? Notes = null
    ) 
    {
        episode = Episode;
        status = Status;
        rating = Rating;
        review = Review;
        start_date = StartDate;
        end_date = EndDate;
        notes = Notes;
    }
}
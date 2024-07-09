namespace MyChroniclesApi.Models.Users;
public class UCAdditonal {
    public string? review { get; set; }
    public DateTime? start_date { get; set; }
    public string? notes { get; set; }
    public UCAdditonal(
        string? Review = null,
        DateTime? StartDate = null,
        string? Notes = null
    ) 
    {
        review = Review;
        start_date = StartDate;
        notes = Notes;
    }
}
namespace MyChroniclesApi.Models.Users;
public class UCChange {
    public float? episode { get; set; }
    public string? status { get; set; }
    public float? rating { get; set; }
    public string? review { get; set; }
    public DateTime? start_date { get; set; }
    public DateTime? last_read { get; set; }
    public string? notes { get; set; }
    public UCChange(
        float? episode = null,
        string? status = null,
        float? rating = null,
        string? review = null,
        DateTime? start_date = null,
        DateTime? last_read = null,
        string? notes = null
    ) 
    {
        this.episode = episode;
        this.status = status;
        this.rating = rating;
        this.review = review;
        this.start_date = start_date;
        this.last_read = last_read;
        this.notes = notes;
    }
}
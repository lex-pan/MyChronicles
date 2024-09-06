using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyChroniclesApi.Models.Logs;
public class ChronicleChanges {
    [Key]
    public Guid id { get; set; }
    public string? title { get; set; }
    public string? author { get; set; }
    public string? category { get; set; }
    public float? episodes { get; set; }
    public string? length { get; set; }
    public string? country { get; set; }
    public string? status { get; set; }
    public DateTime? start_date { get; set; }
    public DateTime? end_date { get; set; }
    public string? synopsis { get; set; }
    public string[] genres { get; set; }
    public string[] tags { get; set; }
    public string[] other_creators { get; set; }
    public string[] alt_titles { get; set; }
    public ChronicleChanges() {}
    public ChronicleChanges(
        string? Title = null,
        string? Author = null,
        string? Category = null,
        float? Episodes = null,
        string? Length = null,
        string? Country = null,
        string? Status = null,
        DateTime? StartDate = null,
        DateTime? EndDate = null,
        string? Synopsis = null,
        string[]? Genres = null,
        string[]? Tags = null,
        string[]? OtherCreators = null,
        string[]? AltTitles = null
    ) 
    {
        id = Guid.NewGuid();
        title = Title;
        author = Author;
        category = Category;
        episodes = Episodes;
        length = Length;
        country = Country;
        status = Status;
        start_date = StartDate;
        end_date = EndDate;
        synopsis = Synopsis;
        genres = Genres ?? [];
        tags = Tags ?? [];
        other_creators = OtherCreators ?? [];
        alt_titles = AltTitles ?? [];
    }
}
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


/*
    string? author,
    float? episodes,
    string? length,
    string? country,
    string status,
    string? start_date,
    string? end_date,
    string? synopsis,
    List<string> genres,
    List<string> tags,
    List<string> other_creators,
    List<string> alt_titles
*/
namespace MyChroniclesApi.Models.Logs;
public class ChronicleChanges {
    [Key]
    public Guid id { get; set; }
    [ForeignKey("editLogId")]
    public Guid editLogId { get; set; }
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
    public ChronicleEditsLog edits { get; set; }
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
        string? Synopsis = null
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
    }
}
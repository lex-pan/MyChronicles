namespace MyChroniclesApi.Models.Chronicles;
public class AllChronicleInfo {
    public Guid chronicle_id { get; set; }
    public string chronicle_title { get; set; }
    public string entertainment_category { get; set; }
    public string status { get; set; }
    public string country { get; set; }
    public string creator { get; set; }
    public float? rating { get; set; }
    public int? members { get; set; }
    public float? episodes { get; set; }
    public string synopsis { get; set; }
    public string? length { get; set; }
    public DateTime? start_date { get; set; }
    public DateTime? end_date { get; set; }
    public string[] genres { get; set; } 
    public string[] tags { get; set; }
    public List<string> alternative_titles { get; set; }
    
    public AllChronicleInfo(
        Guid ChronicleID, 
        string ChronicleTitle, 
        string EntertainmentCategory,
        string Status, 
        string Country, 
        string Creator,
        float? Rating,
        int? Members,
        float? Episodes,
        string Synopsis,
        string? Length,
        DateTime? StartDate,
        DateTime? EndDate,
        string[] Genres,
        string[] Tags,
        List<string> AlternativeTitles
    ) 
    {
        chronicle_id = ChronicleID;
        chronicle_title =ChronicleTitle;
        entertainment_category = EntertainmentCategory;
        status = Status;
        country = Country;
        creator = Creator;
        rating = Rating;
        members = Members;
        episodes = Episodes;
        synopsis = Synopsis;
        length = Length;
        start_date = StartDate;
        end_date = EndDate;
        genres = Genres;
        tags = Tags;
        alternative_titles = AlternativeTitles;
    }
}
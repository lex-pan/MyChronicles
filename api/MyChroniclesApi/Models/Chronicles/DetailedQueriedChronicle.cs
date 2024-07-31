namespace MyChroniclesApi.Models.Chronicles;
public class DetailedQueriedChronicle {
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
    public DetailedQueriedChronicle(
        Guid ChronicleID, 
        string ChronicleTitle, 
        string EntertainmentCategory,
        string Status, 
        string Country, 
        string Creator,
        float? Rating,
        int? Members,
        float? Episodes,
        string Synopsis
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
    }
}
namespace MyChroniclesApi.Models.Chronicles;
public class ExtraChronicleInfo {
    public List<string> genres { get; set; } 
    public List<string> tags { get; set; }
    public List<string> alternative_titles { get; set; }
    public List<string> reviews { get; set; }
    public string summary { get; set; }
    
    public ExtraChronicleInfo(
        List<string> Genres,
        List<string> Tags,
        List<string> AlternativeTitles,
        List<string> Reviews,
        string Summary
    ) 
    {
        genres = Genres;
        tags = Tags;
        alternative_titles = AlternativeTitles;
        reviews = Reviews;
        summary = Summary;
    }
}
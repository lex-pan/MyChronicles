namespace MyChroniclesApi.Models.Chronicles;
public class QueriedChronicle {
    public Guid chronicle_id { get; set; }
    public string chronicle_title { get; set; }
    public string entertainment_category { get; set; }
    public DateTime? year { get; set; }
    public string country { get; set; }
    public string creator { get; set; }
    public QueriedChronicle(Guid ChronicleID, string ChronicleTitle, string EntertainmentCategory, DateTime? Year, string Country, string Creator) {
        chronicle_id = ChronicleID;
        chronicle_title =ChronicleTitle;
        entertainment_category = EntertainmentCategory;
        year = Year;
        country = Country;
        creator = Creator;
    }
}
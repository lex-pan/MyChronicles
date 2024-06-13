namespace MyChroniclesApi.Models.Chronicles;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class AlternativeTitles {
    [Key]
    public Guid id { get; set; } 
    public string alternative_title { get; set; }
    [ForeignKey("chronicle_id")]
    public Guid chronicle_id { get; set; }
    public string? source { get; set; }
    public int? year { get; set; }
    public string? producer { get; set; }    
    public string entertainment_category { get; set; }
    public Chronicles chronicles {get; set;} 
    public AlternativeTitles() {}
    public AlternativeTitles(string AlternativeTitle, Guid ChronicleId, string Source, int Year, string Producer, string EntertainmentCategory) {
        id = Guid.NewGuid();
        alternative_title = AlternativeTitle;
        chronicle_id = ChronicleId;
        source = Source;
        year = Year;
        producer = Producer;
        entertainment_category = EntertainmentCategory;
    }
}
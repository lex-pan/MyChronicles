namespace MyChroniclesApi.Models.Chronicles;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class ChronicleUrlMatch {
    [Key]
    public string url { get; set; }
    [ForeignKey("chronicle_id")]
    public Guid chronicle_id { get; set; }   
    public Chronicles chronicles {get; set;}  
    public ChronicleUrlMatch() {}
    public ChronicleUrlMatch(string AlternativeTitle, string Url, Guid ChronicleId) {
        url = Url;
        chronicle_id = ChronicleId;
    }
}
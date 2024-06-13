namespace MyChroniclesApi.Models.Chronicles;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

// composite key between tag and chronicle id
public class ChroniclesTag { 
    [ForeignKey("chronicle_id")]
    [Key, Column(Order = 0)]
    public Guid chronicle_id { get; set; }
    [Key, Column(Order = 1)]
    public string tag { get; set; }
    public Chronicles chronicles {get; set;} 
    public ChroniclesTag() {}
    public ChroniclesTag(string Tag, Guid ChronicleId) {
        tag = Tag;
        chronicle_id = ChronicleId;
    }
}
namespace MyChroniclesApi.Models.Chronicles;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

// composite key between tag and chronicle id
public class ChronicleCreators { 
    [ForeignKey("chronicle_id")]
    [Key, Column(Order = 0)]
    public Guid chronicle_id { get; set; }
    [ForeignKey("creator_id")]
    [Key, Column(Order = 1)]
    public Guid creator_id { get; set; }
    public Chronicles chronicles {get; set;} 
    public Creators creator {get; set;} 
    public ChronicleCreators() {}
    public ChronicleCreators(Guid CreatorID, Guid ChronicleId) {
        creator_id = CreatorID;
        chronicle_id = ChronicleId;
    }
}
namespace MyChroniclesApi.Models.Chronicles;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

// composite key between character and chronicle
public class ChroniclesCast {
    [ForeignKey("chronicle_id")]
    [Key, Column(Order = 1)]
    public Guid chronicle_id { get; set; }
    [ForeignKey("character_id")]
    [Key, Column(Order = 0)]
    public Guid character_id { get; set; }
    public string? notes { get; set; }   
    public Chronicles chronicles { get; set; }
    public Character characters { get; set; }
    public ChroniclesCast() {}

    public ChroniclesCast(Guid CharacterId, Guid ChronicleId, string Notes) {
        character_id = CharacterId;
        chronicle_id = ChronicleId;
        notes = Notes;
    } 
}
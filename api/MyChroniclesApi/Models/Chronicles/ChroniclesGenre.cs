namespace MyChroniclesApi.Models.Chronicles;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
// composite key between id and genre
public class ChroniclesGenre {
    [ForeignKey("chronicle_id")]
    [Key, Column(Order = 0)]
    public Guid chronicle_id { get; set; }
    [Key, Column(Order = 1)]
    public string genre { get; set; }
    public Chronicles chronicles {get; set;} 
    public ChroniclesGenre() {}

    public ChroniclesGenre(string Genre, Guid ChronicleId) {
        genre = Genre;
        chronicle_id = ChronicleId;
    }
}
namespace MyChroniclesApi.Models.Chronicles;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using MyChroniclesApi.Models.Users;

// composite key between tag and chronicle id
public class ChroniclesReview { 
    [ForeignKey("chronicle_id")]
    [Key, Column(Order = 0)]
    public Guid chronicle_id { get; set; }
    [ForeignKey("user_id")]
    [Key, Column(Order = 1)]
    public string user_id { get; }
    public string review { get; set; }
    public Chronicles chronicles {get; set;}
    public User users { get; set; }
    public ChroniclesReview() {}
    public ChroniclesReview(string Review, Guid ChronicleId, string UserID) {
        review = Review;
        chronicle_id = ChronicleId;
        user_id = UserID;
    }
}
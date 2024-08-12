namespace MyChroniclesApi.Models.Chronicles;
using MyChroniclesApi.Models.Users;

// composite key between tag and chronicle id
public class ChronicleSearchPage { 
    public ChroniclesReview? user_review { get; set; }
    public List<ChroniclesReview> reviews { get; set; }
    public ChronicleSearchPage() {}
    public ChronicleSearchPage(List<ChroniclesReview> Reviews, ChroniclesReview? UserReview) {
        user_review = UserReview;
        reviews = Reviews;
    }
}
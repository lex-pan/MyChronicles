namespace MyChroniclesApi.Models.Chronicles;
using MyChroniclesApi.Models.Users;

public class ChroniclesReview { 
    public string username { get; }
    public string review { get; set; }
    public float? rating { get; set; }
    public float? episodes { get; set; }
    public DateTime? review_date { get; set; }
    public ChroniclesReview() {}
    public ChroniclesReview(string Review, string Username, float? Rating, float? Episodes, DateTime? ReviewDate) {
        review = Review;
        username = Username;
        rating = Rating;
        episodes = Episodes;
        review_date = ReviewDate;
    }
}
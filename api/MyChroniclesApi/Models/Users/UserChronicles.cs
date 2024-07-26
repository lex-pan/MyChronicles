namespace MyChroniclesApi.Models.Users;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MyChroniclesApi.Models.Chronicles;

public class UserChronicles {
    [ForeignKey("user_id")]
    public string user_id { get; set; } 
    [ForeignKey("book_id")]
    public Guid book_id { get; set; } 
    public float? episode { get; set; }
    public string? status { get; set; }
    public float? rating { get; set; }
    public string? review { get; set; }
    public bool private_review { get; set; }
    public DateTime start_date { get; set; }
    public DateTime last_read { get; set; }
    public string? notes { get; set; }
    public string entertainment_category { get; set; }
    public User users { get; set; }
    public Chronicles chronicles { get; set; }
    public UserChronicles() {

    }

    public UserChronicles(
            string UserId, 
            Guid BookID, 
            float? Episode, 
            string EntertainmentCategory,
            string? Status = null,
            float? Rating = null,
            string? Review = null,
            string? Notes = null
        )
    {
        user_id = UserId;
        book_id = BookID;
        episode = Episode;
        status = Status;
        rating = Rating;
        review = Review;
        private_review = true;
        start_date = DateTime.UtcNow;
        last_read = DateTime.UtcNow;
        notes = Notes;
        entertainment_category = EntertainmentCategory;
    }
}

/*
        this.episode = episode;
        this.status = status;
        this.rating = rating;
        this.review = review;
        this.start_date = start_date;
        this.last_read = last_read;
        this.notes = notes;
        this.action = action;
*/
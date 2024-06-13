namespace MyChroniclesApi.Models.Users;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class UserHistory {
    [Key]
    public Guid id { get; set; }
    [ForeignKey("user_id")] // points to user id
    public string user_id { get; set; } 
    public string title { get; set; }
    public int chapter { get; set; }
    public string url { get; set; }
    public DateTime date_read { get; set; }

    public User users { get; set; }

    public UserHistory() {
        // Initialize fields with default values, if needed
        id = Guid.NewGuid();
        date_read = DateTime.UtcNow;
    }
    public UserHistory(string UserId, string Title, int Chapter, string Url)  {
        id = Guid.NewGuid();
        user_id = UserId;
        title = Title;
        chapter = Chapter;
        url = Url;
        date_read = DateTime.UtcNow;
    }
}
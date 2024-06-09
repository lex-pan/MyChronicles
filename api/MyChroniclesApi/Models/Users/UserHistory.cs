namespace MyChroniclesApi.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class UserHistory() {
    [Key]
    public Guid id { get; set; }
    [ForeignKey("user_id")] // points to user id
    public Guid user_id { get; set; } 
    public string title { get; set; }
    public int chapter { get; set; }
    public string url { get; set; }
    public DateTime date_read { get; set; }
}
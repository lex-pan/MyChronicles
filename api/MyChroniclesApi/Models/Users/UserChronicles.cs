namespace MyChroniclesApi.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class UserChronicles() {
    [Key]
    public Guid id { get; set; }
    [ForeignKey("user_id")]
    public Guid user_id { get; set; } 
    [ForeignKey("book_id")]
    public Guid book_id { get; set; } 
    public int rating { get; set; }
    public string review { get; set; }
    public bool private_review { get; set; }
    public DateTime start_date { get; set; }
    public DateTime last_read { get; set; }

}
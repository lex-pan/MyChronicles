using System.ComponentModel.DataAnnotations.Schema;

namespace MyChroniclesApi.Models;

public class UserHistory() {
    private Guid id { get; set; }
    [ForeignKey("username")]
    public string username { get; set; } 
    public string title { get; set; }
    public int chapter { get; set; }
    public string url { get; set; }
    public DateTime date_read { get; set; }
}
namespace MyChroniclesApi.Models;
using System.ComponentModel.DataAnnotations;
public class Urls {
    [Key]
    public string domain { get; set; }
    public string? selection_type { get; set; }
    public string? dom_selector { get; set; }
    public DateTime date_time { get; set; }
    public Urls() {}
    public Urls(string Domain, string Selection, string Dom) {
        domain = Domain;
        selection_type = Selection;
        dom_selector = Dom;
        date_time = DateTime.UtcNow;
    }
}
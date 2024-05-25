namespace MyChroniclesApi.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using MyChroniclesApi.Models;

public class DecipherUrls {
    [Key]
    public string Domain { get; set; }
    public List<DecipherSteps> Title_start_end { get; set; } = new List<DecipherSteps>();
    public List<DecipherSteps> Chapter_start_end { get; set; } = new List<DecipherSteps>();
    public List<DecipherSteps> Entertainment_category { get; set; } = new List<DecipherSteps>();
    public string? Selection_type { get; set; }
    public DOMIdentifier? dom_selector { get; set; }
    public DateTime date_time { get; set; }

    public DecipherUrls() {}
    public DecipherUrls(string domain, List<DecipherSteps> title, List<DecipherSteps> chapter, List<DecipherSteps> entertainment, string selection, DOMIdentifier dom) {
        Domain = domain;
        Title_start_end = title;
        Chapter_start_end = chapter;
        Entertainment_category = entertainment;
        Selection_type = selection;
        dom_selector = dom;
        date_time = DateTime.UtcNow;
    }
}
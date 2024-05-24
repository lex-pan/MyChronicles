namespace MyChroniclesApi.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

public class DecipherUrls {
    [Key]
    public string Domain { get; set; }
    
    [NotMapped]
    public List<List<string>> Title_start_end { get; set; } = new List<List<string>>();
    [NotMapped]
    public List<List<string>> Chapter_start_end { get; set; } = new List<List<string>>();
    [NotMapped]
    public List<List<string>> Entertainment_category { get; set; } = new List<List<string>>();
    [NotMapped]
    public string Selection_type { get; set; }
    [NotMapped]
    public List<string> dom_selector { get; set; } = new List<string>();
    public DateTime date_time { get; set; }

    public DecipherUrls() {}
    public DecipherUrls(string domain, List<List<string>> title, List<List<string>> chapter, List<List<string>> entertainment, string selection, List<string> dom) {
        Domain = domain;
        Title_start_end = title;
        Chapter_start_end = chapter;
        Entertainment_category = entertainment;
        Selection_type = selection;
        dom_selector = dom;
        date_time = DateTime.Now;
    }
}


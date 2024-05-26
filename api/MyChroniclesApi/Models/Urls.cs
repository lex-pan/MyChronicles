namespace MyChroniclesApi.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using MyChroniclesApi.Models;
public class Urls {
    [Key]
    public string Domain { get; set; }
    public string? Selection_type { get; set; }
    public string dom_selector { get; set; }
    public DateTime date_time { get; set; }
    public Urls() {}
    public Urls(string domain, string selection, string dom) {
        Domain = domain;
        Selection_type = selection;
        dom_selector = dom;
        date_time = DateTime.UtcNow;
    }
}
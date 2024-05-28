namespace MyChroniclesApi.Models;
using System.ComponentModel.DataAnnotations;
using MyChroniclesApi.ServiceErrors;

public class Urls {
    [Key]
    public string domain { get; set; }
    public string? selection_type { get; set; }
    public string? dom_selector { get; set; }
    public DateTime date_time { get; set; }
    public Urls() {}
    private Urls(string Domain, string Selection, string Dom) {
        domain = Domain;
        selection_type = Selection;
        dom_selector = Dom;
        date_time = DateTime.UtcNow;
    }
    public static ErrorOr<Urls> Create(string Domain, string Selection, string Dom) {
        if (Domain == "" || Domain == null) {
            return ErrorOr<Urls>.Failure(Error.InvalidInput("", "domain can't be empty or null"));
        }

        if (Selection != "title" && Selection != "url") {
            return ErrorOr<Urls>.Failure(Error.InvalidInput("", "invalid selection type"));
        }

        return ErrorOr<Urls>.Success(new Urls(Domain, Selection, Dom));
    }
}
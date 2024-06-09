namespace MyChroniclesApi.Models;
using System.ComponentModel.DataAnnotations;
using MyChroniclesApi.ServiceErrors;

public class Urls {
    [Key]
    public string domain { get; set; }
    public string? decipher_method { get; set; }
    public DateTime date_time { get; set; }
    public Urls() {}
    private Urls(string Domain, string Selection) {
        domain = Domain;
        decipher_method = Selection;
        date_time = DateTime.UtcNow;
    }

    public static ErrorOr<Urls> Create(string Domain, List<string> decipher_method_categories) {
        string decipher_method = "";
        
        if (Domain == "" || Domain == null) {
            return ErrorOr<Urls>.Failure(Error.InvalidInput("", "domain can't be empty or null"));
        }

        if (decipher_method_categories.Count != 3) {
            return ErrorOr<Urls>.Failure(Error.InvalidInput("", "invalid number of decipher categories"));
        } else {
            decipher_method = decipher_method_categories[0];
        }   

        for (int i = 1; i < decipher_method_categories.Count; i++) {
            if (decipher_method_categories[i] != "url" && decipher_method_categories[i] != "title") {
                return ErrorOr<Urls>.Failure(Error.InvalidInput("", "invalid decipher category type"));
            } else {
                decipher_method = decipher_method + " " + decipher_method_categories[i];
            }
        }
        
        return ErrorOr<Urls>.Success(new Urls(Domain, decipher_method));
    }
}
namespace MyChroniclesApi.Models.Urls;
using System.ComponentModel.DataAnnotations;
using MyChroniclesApi.ServiceErrors;

public class DomainDecipher {
    [Key]
    public string domain { get; set; }
    public string? decipher_method { get; set; }
    public DateTime date_time { get; set; }
    public DomainDecipher() {}
    private DomainDecipher(string Domain, string Selection) {
        domain = Domain;
        decipher_method = Selection;
        date_time = DateTime.UtcNow;
    }

    public static ErrorOr<DomainDecipher> Create(string Domain, List<string> decipher_method_categories) {
        string decipher_method = "";
        
        if (Domain == "" || Domain == null) {
            return ErrorOr<DomainDecipher>.Failure(Error.InvalidInput("", "domain can't be empty or null"));
        }

        if (decipher_method_categories.Count != 3) {
            return ErrorOr<DomainDecipher>.Failure(Error.InvalidInput("", "invalid number of decipher categories"));
        } else {
            decipher_method = decipher_method_categories[0];
        }   

        for (int i = 1; i < decipher_method_categories.Count; i++) {
            if (decipher_method_categories[i] != "url" && decipher_method_categories[i] != "title") {
                return ErrorOr<DomainDecipher>.Failure(Error.InvalidInput("", "invalid decipher category type"));
            } else {
                decipher_method = decipher_method + " " + decipher_method_categories[i];
            }
        }
        
        return ErrorOr<DomainDecipher>.Success(new DomainDecipher(Domain, decipher_method));
    }
}
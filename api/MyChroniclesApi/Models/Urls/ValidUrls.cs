namespace MyChroniclesApi.Models.Urls;
using System.ComponentModel.DataAnnotations;
using MyChroniclesApi.ServiceErrors;

public class ValidUrls {
    [Key]
    public string regex_url {get; set;}
    public ValidUrls() {}
    public ValidUrls(string validURL) {
        regex_url = validURL;
    }
}
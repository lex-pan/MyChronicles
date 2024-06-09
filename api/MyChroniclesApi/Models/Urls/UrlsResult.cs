namespace MyChroniclesApi.Models;
using MyChroniclesApi.ServiceErrors;

public class UrlsResult {
    public string decipher_method { get; set; }
    public List<DecipherUrlSteps> instructions { get; set; } = new List<DecipherUrlSteps>();
    public UrlsResult() {}

    private UrlsResult( string decipher_categories, List<DecipherUrlSteps> Instructions) {
        decipher_method = decipher_categories;  
        instructions = Instructions;
    }
    public ErrorOr<UrlsResult> Create(Urls url, List<DecipherUrlSteps> instructions) {
        if (url == null) {
            return null;
        }
        return ErrorOr<UrlsResult>.Success(new UrlsResult(url.decipher_method, instructions));
    }
}
namespace MyChroniclesApi.Models;
using MyChroniclesApi.ServiceErrors;

public class UrlsResult {
    public string domain { get; set; }
    public string decipher_method { get; set; }
    public List<DecipherUrlSteps> instructions { get; set; } = new List<DecipherUrlSteps>();
    public UrlsResult() {}

    private UrlsResult(Urls url, List<DecipherUrlSteps> Instructions) {
        domain = url.domain;
        decipher_method = url.decipher_method;  
        instructions = Instructions;
    }
    public ErrorOr<UrlsResult> Create(Urls url, List<DecipherUrlSteps> instructions) {
        if (url == null) {
            return null;
        }

        return ErrorOr<UrlsResult>.Success(new UrlsResult(url, instructions));
    }
}
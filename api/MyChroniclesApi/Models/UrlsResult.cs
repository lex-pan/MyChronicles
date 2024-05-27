namespace MyChroniclesApi.Models;

public class UrlsResult {
    public string domain { get; set; }
    public string? selection_type { get; set; }
    public string dom_selector { get; set; }
    public List<DecipherUrlSteps> instructions { get; set; } = new List<DecipherUrlSteps>();
    public UrlsResult(Urls url, List<DecipherUrlSteps> Instructions) {
        domain = url.domain;
        selection_type = url.selection_type;
        dom_selector = url.dom_selector;        
        instructions = Instructions;
    }
}
namespace MyChroniclesApi.Contracts.Urls;
public record UrlDecipherResponse(
    string Selection_type,
    List<List<object>> Title_start_end,
    List<List<object>> Chapter_start_end,
    List<List<object>> Entertainment_category,
    List<object> dom_selector
);


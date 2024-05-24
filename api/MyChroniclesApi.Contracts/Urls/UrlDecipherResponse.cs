namespace MyChroniclesApi.Contracts.Urls;
public record UrlDecipherResponse(
    string Domain,
    List<List<string>> Title_start_end,
    List<List<string>> Chapter_start_end,
    List<List<string>> Entertainment_category,
    string Selection_type,
    List<List<string>> dom_selector,
    DateTime command_date_time
);


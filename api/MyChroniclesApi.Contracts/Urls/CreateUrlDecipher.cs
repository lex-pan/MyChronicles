namespace MyChroniclesApi.Contracts.Urls;
public record CreateUrlDecipher(
    string Domain,
    List<List<object>> Title_start_end,
    List<List<object>> Chapter_start_end,
    List<List<object>> Entertainment_category,
    string Selection_type,
    List<object> dom_selector
);
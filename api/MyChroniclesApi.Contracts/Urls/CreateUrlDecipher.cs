namespace MyChroniclesApi.Contracts.Urls;
public record CreateUrlDecipher(
    string domain,
    List<string> decipher_method,
    List<List<object>> title_start_end,
    List<List<object>> chapter_start_end,
    List<List<object>> entertainment_category
);
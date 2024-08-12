
namespace MyChroniclesApi.Contracts.Chronicles;
public record ChronicleContractEdit(
    string chronicle_id,
    string? author,
    float? episodes,
    string? length,
    string? country,
    string status,
    string? start_date,
    string? end_date,
    string? synopsis,
    string[]? genres,
    string[]? tags,
    List<string> other_creators,
    List<string> alt_titles
);
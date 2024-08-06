namespace MyChroniclesApi.Contracts.Chronicles;
public record NewChronicle(
    string title,
    string? author,
    string category,
    float? episodes,
    string? length,
    string? country,
    string status,
    string? start_date,
    string? end_date,
    string synopsis
);
namespace MyChroniclesApi.Contracts.Users;

public record UpdateIndividualUC(
    Guid chronicle_id,
    string? status, 
    float? rating,
    string? review,
    float? episode
);
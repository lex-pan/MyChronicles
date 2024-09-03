namespace MyChroniclesApi.Contracts.Users;

public record ManualExtensionUpdate(
    string chronicle_id,
    string? status, 
    float? rating,
    string? review,
    string? notes
);
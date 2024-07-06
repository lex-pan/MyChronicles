namespace MyChroniclesApi.Contracts.Users;

public record ManualExtensionUpdate(
    string user_id,
    Guid book_id,
    string? status, 
    int? rating,
    string? review,
    string? notes
);
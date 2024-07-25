namespace MyChroniclesApi.Contracts.Users;

public record ManualExtensionUpdate(
    string user_id,
    Guid book_id,
    string? status, 
    int? rating,
    string? review,
    string? notes
);

/*
                "chronicleID": chronicleId,
                "status": status,
                "rating": rating,
                "review": review,
                "episode": episode
*/
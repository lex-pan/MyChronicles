namespace MyChroniclesApi.Contracts.Users;

public record ManualExtensionUpdate(
    string chronicle_id,
    string? status, 
    float? rating,
    string? review,
    string? notes
);

/*
        "chronicle_id" : userChronicleInfo.book_id,
        "status": status,
        "rating": rating,
        "review": review,
        "notes": notes
*/
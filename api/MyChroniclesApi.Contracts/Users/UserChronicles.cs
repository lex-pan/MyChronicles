namespace MyChroniclesApi.Contracts.Users;
public record AutomaticExtensionUpdate(
    string title,
    int chapter,
    string url,
    string entertainment_category,
    DateTime timeRead
);
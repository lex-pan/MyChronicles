namespace MyChroniclesApi.Contracts.Users;

public record UpdateUserChronicles (
    Dictionary<string, Dictionary<string, string>> listOfChanges
);
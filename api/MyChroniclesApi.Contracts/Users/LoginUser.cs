namespace MyChroniclesApi.Contracts.Users;
public record LoginUser(
    string emailOrUsername,
    string password
);
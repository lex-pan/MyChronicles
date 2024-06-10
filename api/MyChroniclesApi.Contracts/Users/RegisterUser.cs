namespace MyChroniclesApi.Contracts.Users;
public record RegisterUser(
    string email,
    string username,
    string password
);
namespace MyChroniclesApi.Models;
using System.ComponentModel.DataAnnotations;
using System.Reflection.Metadata;
using MyChroniclesApi.ServiceErrors;

public class Users {
    [Key]
    private string username;
    private string password;
    public DateTime account_creation_date { get; set; }
    public string? profile_image { get; set; }
    public string? bio { get; set; }
    private DateTime? last_login;
    public string? preferred_language { get; set; }

    public Users() {}

    private Users(string Username, string Password) {
        username = Username;
        password = Password;
        account_creation_date = DateTime.UtcNow;
        profile_image = null;
        bio = null;
        last_login = null;
        preferred_language = "English";
    }

    public ErrorOr<Users> Create(string Username, string Password) {
        if (Username.Length < 4 || Username.Length > 30) {
            return ErrorOr<Users>.Failure(Error.InvalidInput("", "Usernames must be more than 3 characters and less than 30 characters"));
        }

        if (Password.Length < 8) {
            return ErrorOr<Users>.Failure(Error.InvalidInput("", "Passwords must be at least 8 characters long"));
        }
        
        // check if username is already being used
        // hash password

        return ErrorOr<Users>.Success(new Users(Username, Password));
    }
}
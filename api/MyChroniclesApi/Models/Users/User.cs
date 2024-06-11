namespace MyChroniclesApi.Models;
using Microsoft.AspNetCore.Identity;

/*
The IdentityUser class includes the following properties by default:
    Id: The unique identifier for the user (usually a GUID).
    UserName: The username for the user.
    NormalizedUserName: The normalized username for the user (usually in uppercase for lookup purposes).
    Email: The email address for the user.
    NormalizedEmail: The normalized email address for the user (usually in uppercase for lookup purposes).
    EmailConfirmed: A flag indicating whether the email address has been confirmed.
    PasswordHash: The hashed password for the user.
    SecurityStamp: A random value that changes whenever a user's credentials change (used for security purposes).
    ConcurrencyStamp: A random value that changes whenever a user object is persisted to the store (used for concurrency checking).
    PhoneNumber: The phone number for the user.
    PhoneNumberConfirmed: A flag indicating whether the phone number has been confirmed.
    TwoFactorEnabled: A flag indicating whether two-factor authentication is enabled for the user.
    LockoutEnd: The date and time when the user’s lockout ends (if any).
    LockoutEnabled: A flag indicating whether the user can be locked out.
    AccessFailedCount: The number of failed access attempts for the user.

We can add our own custom attributes down below

Custom Properties in Users Class: You need to initialize these as required, typically in the constructor or when creating an instance.
Custom Class Inheritance: For your own classes that inherit from other custom classes, you are responsible for initializing both inherited properties and new properties. Call the base class constructor to ensure proper initialization.
*/
public class User : IdentityUser {
    public DateTime account_creation_time { get; }
    public string? bio { get; set; }
    public DateTime last_login { get; set; }
    public string preferred_language { get; set; }

    // Parameterless constructor
    public User() 
    {
        account_creation_time = DateTime.UtcNow;
        last_login = DateTime.UtcNow;
        preferred_language = "English";
    }
    public User(string username, string email) {
        UserName = username;
        Email = email;
        account_creation_time = DateTime.UtcNow;
        last_login = DateTime.UtcNow; // Assuming initial last login time as now for new user
        preferred_language = "English"; // Default language can be set as needed
    }
}

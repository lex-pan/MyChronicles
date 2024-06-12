using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using MyChroniclesApi.Services.Users;
namespace MyChroniclesApi.Controllers;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MyChroniclesApi.Models;
using MyChroniclesApi.Contracts.Users;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

/*
User Registration Flow

    UserManager Validates:
        The UserManager<User> checks the submitted email and password against validation rules (e.g., password strength, unique email).
        UserManager automatically handles password hashing, ensuring passwords are stored securely 

    UserManager Creates and Saves User:
        If validation passes, UserManager<User> creates the User entity.
        It then uses UsersService (DbContext) to save the new user to the database.

    SignInManager Authenticates:
        Once the user is saved, SignInManager<User> handles the login process.
        It creates an authentication session (via cookies or tokens) so the user stays logged in while interacting with the website.
*/
[EnableCors("http://localhost:3000")]
[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase {
    // for accessing tables in UsersService
    private readonly UsersService _user;
    // This service is responsible for managing user-related operations in the ASP.NET Core Identity framework. 
    //It handles user creation, password validation, adding/removing roles, updating user details, etc.
    private readonly UserManager<User> _userManager;
    //This service handles user authentication. It manages sign-in and sign-out processes, as well as other authentication-related operations. 
    //It works in conjunction with UserManager<User> to validate users' credentials and manage their authentication status.
    private readonly SignInManager<User> _signInManager;
    public UserController(UserManager<User> userManager, SignInManager<User> signInManager, UsersService User)
    {
        _user = User;
        _userManager = userManager;
        _signInManager = signInManager;
    }

    // my goal is to allow users to register
    [HttpPost("register")]
    public async Task<IActionResult> CreateValidUser(RegisterUser request) {
        if (invalidEmail(request.email)) {
            return BadRequest("Invalid email format.");
        }

        if (invalidUsername(request.username)) {
            return BadRequest("Usernames must be between 3 and 30 characters");
        }

        if (invalidPassword(request.password)) {
            return BadRequest("Passwords must contain between 8-32 characters with at least one uppercase letter, one number, and one non special character");
        }

        var existingUsername = await _userManager.FindByNameAsync(request.username);
        if (existingUsername != null) {
            return BadRequest("Username already in use");
        }

        // Check if email is already in use
        var existingEmail = await _userManager.FindByEmailAsync(request.email);
        if (existingEmail != null) {
            return BadRequest("Email is already in use.");
        }

        // Add more custom validation logic as needed

        // If validation passes, create the user
        var newUser = new User(request.username, request.email);
        var result = await _userManager.CreateAsync(newUser, request.password);
        if (result.Succeeded) {
            // add functionality where email is sent to user confirming account registration
            return Ok("User created");
        } else {
            return StatusCode(500, result);
        }
        
    }

    [HttpPost("login")]
    public async Task<IActionResult> UserLogin(LoginUser request) {
        var user = await _userManager.FindByNameAsync(request.emailOrUsername) ?? await _userManager.FindByEmailAsync(request.emailOrUsername);
        bool validPassword;

        if (user == null) {
            return BadRequest("Invalid username or email");
        } else {
            validPassword = await _userManager.CheckPasswordAsync(user, request.password);
        }

        if (validPassword) {
            try {
                await _signInManager.PasswordSignInAsync(user, request.password, isPersistent: true, lockoutOnFailure: false);
                return Ok();
            } catch {
                return StatusCode(500, "internal server error");
            }

        } else {
            return BadRequest("Invalid password");
        }
    }

    // implement user logout
    [HttpGet("logout")]
    public async Task<IActionResult> UserLogout() {
        await _signInManager.SignOutAsync();
        return Ok("User logged out successfully");
    }

    [HttpGet("login-status")]
    public async Task<IActionResult> UserLoginStatus() {
        bool isSignedIn = _signInManager.IsSignedIn(User);

        if (isSignedIn) {
            return Ok(true);
        } else {
            return Ok(false);
        }
        
    }

    private bool invalidEmail(string email) {
        var emailAttribute = new EmailAddressAttribute();
        if (emailAttribute.IsValid(email)) {
            return false;
        } else {
            return true;
        }
    }

    private bool invalidUsername(string username) {
        if (username.Length >= 3 && username.Length <= 32) {
            return false;
        } else {
            return true;
        }
    }

    private bool invalidPassword(string password) {
        int length = 0;
        bool hasUpper = false;
        bool hasNumber = false;
        bool nonAlphaNumeric = false;
        for (int i=0; i < password.Length; i++) {
            char c = password[i];
            if (char.IsUpper(c)) {
                hasUpper = true;
            }

            if (char.IsDigit(c)) {
                hasNumber= true;
            }
            
            if (!char.IsLetterOrDigit(c)) {
                nonAlphaNumeric = true;
            }

            length++;
        }

        if (length >= 8 && length <= 32 && hasUpper && hasNumber && nonAlphaNumeric) {
            return false;
        } else {
            return true;
        }
    }

}
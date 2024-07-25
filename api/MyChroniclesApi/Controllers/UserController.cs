using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using MyChroniclesApi.Services;
namespace MyChroniclesApi.Controllers;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MyChroniclesApi.Models.Users;
using MyChroniclesApi.Contracts.Users;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims; // Ensure this using directive is included
using MyChroniclesApi.Models.Chronicles;
using MyChroniclesApi.ServiceErrors;
using Newtonsoft.Json;

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
    private readonly ChroniclesService _chronicles;
    public UserController(UserManager<User> userManager, SignInManager<User> signInManager, UsersService User, ChroniclesService Chronicles)
    {
        _user = User;
        _userManager = userManager;
        _signInManager = signInManager;
        _chronicles = Chronicles;
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
                ErrorOr<List<RetrievedUserChronicle>> retrievedChronicles = await _user.retrieveUCByName(user.Id);
                Dictionary<Guid, RetrievedUserChronicle> convertedUC = UCarrayToDictionary(retrievedChronicles.value);

                if (retrievedChronicles.error.Description == "No Error") {
                    return Ok(new {userChronicles = convertedUC, username = user.UserName });
                } else {
                    return Ok("logged in successfully but error retrieving chronicles");
                }
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
        string Username = User.FindFirst(ClaimTypes.Name)?.Value;

        if (isSignedIn) {
            return Ok(Username);
        } else {
            return Ok(false);
        }
    }

    [HttpPost("automatic-update")]
    public async Task<IActionResult> AutomaticUserUpdate(AutomaticExtensionUpdate info) {
        bool isSignedIn = _signInManager.IsSignedIn(User);
        if (!isSignedIn) {
            return StatusCode(300, "User must be logged in for automatic updates");
        }

        // if chronicle with name does not exist, create a copy of it with only the name initalized, return guid of chronicle
        ErrorOr<Guid> chronicleId = await chronicleID(info.title, info.entertainment_category, info.url);

        if (chronicleId.error.Description == "internal server error") {
            return StatusCode(500, "internal server error");
        }
        
        if (chronicleId.error.Description != "No Error") {
            return BadRequest(chronicleId.error);
        }

        UserHistory history = new UserHistory(
            User.FindFirst(ClaimTypes.NameIdentifier)?.Value,
            info.title,
            info.chapter,
            info.url,
            "Reading"
        );

        await _user.addUserHistory(history); 

        UserChronicles newUserChronicle = new UserChronicles(
            UserId: User.FindFirst(ClaimTypes.NameIdentifier)?.Value,
            BookID: chronicleId.value,
            Episode: info.chapter,
            EntertainmentCategory: info.entertainment_category,
            Status: "Reading"
        );

        ErrorOr<UserChronicles> updatedUC = await _user.updateAutomaticUserchronicle(newUserChronicle);

        if (updatedUC.error.Description == "No Error") {
            return Ok(new {updatedUC.value.user_id, updatedUC.value.book_id, updatedUC.value.status, updatedUC.value.rating, updatedUC.value.review, updatedUC.value.notes});
        } else {
            return StatusCode(500, updatedUC.error);
        }
    }

    [HttpPost("manual-extension-update")]
    public async Task<IActionResult> ManualExtensionUpdate(ManualExtensionUpdate info) {
        bool isSignedIn = _signInManager.IsSignedIn(User);
        if (!isSignedIn) {
            return StatusCode(300, "User must be logged in for automatic updates");
        }

        UCChange changes = new UCChange(
            status: info.status,
            rating: info.rating,
            review: info.review,
            notes: info.notes,
            action: "Update"
        );

        var chroniclesToUpdate = new Dictionary<Guid, UCChange>
        {
            { info.book_id, changes }
        };

        ErrorOr<string> updateChronicleAttributes = await _user.updateFlexibleUserChronicles(chroniclesToUpdate, User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

        if (updateChronicleAttributes.error.Description == "No Error") {
            return Ok("successfully added");
        } else {
            return StatusCode(500, "internal server error");
        }
    }

    // gets chronicles based on credentials
    [HttpGet("chronicles")]
    public async Task<IActionResult> retrieveUserChroniclesByCredentials() {
        bool isSignedIn = _signInManager.IsSignedIn(User);
        
        if (!isSignedIn) {
            return StatusCode(300, "User must be logged in to initialize user chronicle store");
        }

        string user_id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        ErrorOr<List<RetrievedUserChronicle>> retrievedChronicles = await _user.retrieveUCByName(user_id);
        Dictionary<Guid, RetrievedUserChronicle> convertedUC = UCarrayToDictionary(retrievedChronicles.value);

        if (retrievedChronicles.error.Description == "No Error") {
            return Ok(new {username = User.FindFirst(ClaimTypes.Name)?.Value,  userChronicles = convertedUC});
        } else {
            return StatusCode(500, retrievedChronicles.error);
        }
            
    }

    // gets chronicles based on username
    [HttpGet("{username}/chronicles")]
    public async Task<IActionResult> retrieveUserChroniclesByRoute(string username) {
        var userExists = await _userManager.FindByNameAsync(username);

        if (userExists != null) {

            bool isSignedIn = _signInManager.IsSignedIn(User);
            if (isSignedIn && username == User.FindFirst(ClaimTypes.Name)?.Value) {
                return Ok("data loaded on login/initialization");
            }

            // retrieve all user chronicles with listed username
            // on retrieval exlude username, review, notes, start_date
            string user_id = userExists.Id;
            ErrorOr<List<RetrievedUserChronicle>> retrievedChronicles = await _user.retrieveUCByName(user_id);
            Dictionary<Guid, RetrievedUserChronicle> convertedUC = UCarrayToDictionary(retrievedChronicles.value);

            return Ok(new {convertedUC, username, isSignedIn, User.FindFirst(ClaimTypes.Name)?.Value});
        } else {
            return NotFound("username does not exist");
        }    
    }

    [HttpGet("{username}/chronicles/additional/{book_id}")]
    public async Task<IActionResult> userChronicleAdditionalInfo(string username, string book_id) {
        var user = await _userManager.FindByNameAsync(username);
        if (user is null) {
            return NotFound("user not found");
        }

        Guid bookID = new Guid(book_id);
        ErrorOr<UCAdditonal> additional_info = await _user.retrieveUCAdditional(user.Id, bookID);

        if (additional_info.error.Description == "No Error") {
            return Ok(additional_info.value);
        } else {
            return StatusCode(300, additional_info.error.Description);
        }
    }

    [HttpGet("{username}/profile")]
    public async Task<IActionResult> initializeUserProfile(string username) {
        // check if user exists
        // if they do retrieve their about section
        var userExists = await _userManager.FindByNameAsync(username);

        if (userExists == null) {
            return Ok("username does not exist");
        } else {    
            ErrorOr<RetrievedUserProfile> userProfileData = await _user.retrieveUserProfile(userExists.Id);

            if (userProfileData.error.Description == "No Error") {
                return Ok(userProfileData.value);
            } else {
                return StatusCode(500, userProfileData.error);
            }
        }
    }

    [HttpGet("{username}/exists")]
    public async Task<IActionResult> checkUserExists(string username) {
        var userExists = await _userManager.FindByNameAsync(username);
        if (userExists == null) {
            return Ok("username does not exist");
        } else {    
            return Ok("username exists");
        }
    }

    //http://localhost:5172/user/${username}/bio

    [HttpPost("{username}/bio")]
    public async Task<IActionResult> updateUserBio(string username, UpdatedBio bioInfo) {
        var userExists = await _userManager.FindByNameAsync(username);
        if (userExists == null) {
            return BadRequest("User does not exist");
        } else {
            ErrorOr<string> update = await _user.updateBio(userExists.Id, bioInfo.bio);

            if (update.error.Description == "No Error") {
                return Ok(update.value);
            } else {
                return StatusCode(500, update.error);
            }
        }
    }

    [HttpPost("{username}/chronicles/update")]
    public async Task<IActionResult> updateUserChronicles(string username, UpdateUserChronicles changes) {
        var user = await _userManager.FindByNameAsync(username);

        if (user is null) {
            return NotFound("user not found");
        }

        Dictionary<Guid, UCChange> chroniclesToUpdate = new Dictionary<Guid, UCChange>();

        // loops through each user chronicle changed
        // we map the change in each user chronicle changed to UCChange
        // this is completed by looping through the properties of the object we pass in
        // it checks if UCChange has the property and if it does we will replace it
        // then we will add it to the list of user chronicles we changed
    
        foreach (string UserChronicleBookID in changes.listOfChanges.Keys) {
            UCChange UCAttributesChange = new UCChange();
            var UCAttributesChangeType = UCAttributesChange.GetType();

            // loops through all properties of user chronicle we pass in 
            foreach (string UCproperty in changes.listOfChanges[UserChronicleBookID].Keys) {
                var mappedProperty = UCAttributesChangeType.GetProperty(UCproperty);

                if (mappedProperty != null && mappedProperty.CanWrite) {
                    var type = mappedProperty.PropertyType;
                    if (Nullable.GetUnderlyingType(mappedProperty.PropertyType) != null) {
                        type = Nullable.GetUnderlyingType(mappedProperty.PropertyType);
                    }   
                    
                    if (UCproperty == "last_read" || UCproperty == "start_date") {
                        if (changes.listOfChanges[UserChronicleBookID][UCproperty] == "") {
                            mappedProperty.SetValue(UCAttributesChange, new DateTime(1, 1, 1));
                        } else {
                            DateTime castValue = DateTime.Parse(changes.listOfChanges[UserChronicleBookID][UCproperty]).ToUniversalTime();
                            mappedProperty.SetValue(UCAttributesChange, castValue);

                        }
                    } else {
                        if (changes.listOfChanges[UserChronicleBookID][UCproperty] is null) {
                            mappedProperty.SetValue(UCAttributesChange, null);
                        } else {
                            var castValue = Convert.ChangeType(changes.listOfChanges[UserChronicleBookID][UCproperty], type);
                            mappedProperty.SetValue(UCAttributesChange, castValue);
                        }
                    }
                }
            }

            Guid book_id = new Guid(UserChronicleBookID);
            chroniclesToUpdate.Add(book_id, UCAttributesChange);
        }   

        ErrorOr<string> updateChronicleAttributes = await _user.updateFlexibleUserChronicles(chroniclesToUpdate, user.Id);
        if (updateChronicleAttributes.error.Description == "No Error") {
            return Ok(chroniclesToUpdate);
        } else {
            return StatusCode(400, new {chroniclesToUpdate, updateChronicleAttributes.error});
        }
    }

    [HttpPost("chronicles/add")]
    public async Task<IActionResult> addNewUserChronicle(string username, UpdateUserChronicles changes) {
        
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

    public Dictionary<Guid, RetrievedUserChronicle> UCarrayToDictionary(List<RetrievedUserChronicle> userChronicles) {
        Dictionary<Guid, RetrievedUserChronicle> converted = new Dictionary<Guid, RetrievedUserChronicle>();

        for (int i = 0; i < userChronicles.Count; i++) {
            converted.Add(userChronicles[i].book_id, userChronicles[i]);
        }

        return converted;
    }

    // if a chronicle with the title exists return the ID
    // otherwise create one and return the newly generated ID
    // if there are dupes compare with url, if not successful just use first dupe
    private async Task<ErrorOr<Guid>> chronicleID(string title, string entertainment_category, string url) {
        ErrorOr<AlternativeTitles> alt_title_exists = await _chronicles.existingChronicle(title, entertainment_category);

        if (alt_title_exists.error.Description == "alternative title does not exist") {
            // create a model that accepts a chronicle with only the name
            var newChronicle = Chronicles.CreateAutomatic(
                title,
                entertainment_category
            );

            if (newChronicle.error.Description == "No Error") {
                
                var new_alt_title = new AlternativeTitles(
                    newChronicle.value.title,
                    newChronicle.value.chronicle_id,
                    newChronicle.value.entertainment_category
                );

                ErrorOr<string> successfullyAdded = await _chronicles.addChronicle(newChronicle.value, new_alt_title);

                if (successfullyAdded.error.Description == "something went wrong with the server") {
                    return ErrorOr<Guid>.Failure(new Error("", "internal server error"));
                }
                
                return ErrorOr<Guid>.Success(newChronicle.value.chronicle_id);
            } else {
                // not a valid entry
                return ErrorOr<Guid>.Failure(newChronicle.error);
            }
        } else {
            AlternativeTitles alt_title = alt_title_exists.value;

            // check if there are other chronicles with this name
            // if there are, then the chronicle_id of this title might not be accurate
            // therefore must check if there is a corresponding url
            if (alt_title.isUnique == false) {
                ErrorOr<Guid> matching_url = await _chronicles.matchUrls(url);

                return matching_url;
            }

            return ErrorOr<Guid>.Success(alt_title.chronicle_id);
        }
    }

}
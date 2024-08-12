using Microsoft.AspNetCore.Mvc;
using MyChroniclesApi.Contracts.Urls;
using MyChroniclesApi.Models;
using MyChroniclesApi.ServiceErrors;
using MyChroniclesApi.Services;
namespace MyChroniclesApi.Controllers;

using MyChroniclesApi.Contracts.Chronicles;
using MyChroniclesApi.Models.Chronicles;
using MyChroniclesApi.Models.Logs;
using MyChroniclesApi.Models.Users;
using System.Security.Claims; // Ensure this using directive is included

[ApiController]
[Route("[controller]")]
public class ChroniclesController : ControllerBase {
    private readonly ChroniclesService _MyChroniclesDb;
    private readonly LogsService _MyChroniclesLogger;

    public ChroniclesController(ChroniclesService database, LogsService logger) {
        _MyChroniclesDb = database;
        _MyChroniclesLogger = logger;
    }

    [HttpGet("query/{queryString}")]
    public async Task<IActionResult> chroniclesQuery(string queryString) {
        ErrorOr<List<QueriedChronicle>> listOfChronicles = await _MyChroniclesDb.queryChroniclesByString(queryString);

        if (listOfChronicles.error.Description == "No Error") {
            return Ok(listOfChronicles.value);
        } else {
            return StatusCode(500, listOfChronicles.error);
        }
    }

    [HttpGet("detailed-query/{queryString}/{pageNumber}")]
    public async Task<IActionResult> chroniclesDetailedQuery(string queryString, int pageNumber) {
        ErrorOr<List<DetailedQueriedChronicle>> listOfChronicles = await _MyChroniclesDb.queryChroniclesByStringDetailed(queryString, pageNumber);

        if (listOfChronicles.error.Description == "No Error") {
            return Ok(listOfChronicles.value);
        } else {
            return StatusCode(500, listOfChronicles.error);
        }
    }

    [HttpGet("{chronicleId}/exists")]
    public async Task<IActionResult> chronicleExists(string chronicleId) {
        var isValid = Guid.TryParse(chronicleId, out _);
        if (!isValid) {
            return Ok(Error.InvalidInput("", "invalid guid format"));
        }
        Guid chronicleID = new Guid(chronicleId);
        ErrorOr<bool> exists = await _MyChroniclesDb.existingChronicleById(chronicleID);

        if (exists.error.Description == "No Error") {
            return Ok(exists.value);
        } else {
            return StatusCode(500, exists.error);
        }
    }

    //    const chronicle = await fetch(`http://localhost:5172/chronicles/detailed-chronicle/${chronicleId}`, {
    [HttpGet("detailed-chronicle/{chronicleId}")]
    public async Task<IActionResult> ChronicleDetails(string chronicleId) {
        var isValid = Guid.TryParse(chronicleId, out _);
        if (!isValid) {
            return Ok(Error.InvalidInput("", "invalid guid format"));
        }

        Guid chronicleID = new Guid(chronicleId);
        ErrorOr<bool> exists = await _MyChroniclesDb.existingChronicleById(chronicleID);

        if (exists.error.Description == "No Error" && exists.value) {
            ErrorOr<AllChronicleInfo> extraInfo = await _MyChroniclesDb.retrieveAdditionalChronicleInfo(chronicleID);
            
            return Ok(extraInfo.value);
        } else {
            return StatusCode(500, exists);
        }
    }
    
    [HttpGet("reviews/{chronicleId}")]
    public async Task<IActionResult> retrieveChronicleReviews(string chronicleId) {
        var isValidGuid = Guid.TryParse(chronicleId, out _);
        if (!isValidGuid) {
            return Ok(Error.InvalidInput("", "invalid guid format"));
        }

        Guid chronicleID = new Guid(chronicleId);
        ErrorOr<bool> exists = await _MyChroniclesDb.existingChronicleById(chronicleID);

        if (exists.error.Description == "No Error" && exists.value) {
            string user_id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            ErrorOr<ChronicleSearchPage> extraInfo = await _MyChroniclesDb.retrieveChronicleReviewsById(chronicleID, user_id);
            
            return Ok(extraInfo.value);
        } else {
            return StatusCode(500, exists);
        }
    }

    [HttpPost("add")]   
    public async Task<IActionResult> chronicleSubmission(NewChronicle chronicle) {
        ErrorOr<Chronicles> validatedChronicle = Chronicles.AddManual(chronicle);

        if (validatedChronicle.error.Description == "No Error" && validatedChronicle.value != null) {
            ChronicleChanges newInfo = new ChronicleChanges(
                Title: chronicle.title,
                Author: chronicle.author,
                Category: chronicle.category,
                Episodes: chronicle.episodes,
                Length: chronicle.length,
                Country: chronicle.country,
                Status: chronicle.status,
                StartDate: validatedChronicle.value.start_date,
                EndDate: validatedChronicle.value.end_date,
                Synopsis: chronicle.synopsis
            );

            ChronicleEditsLog edits = new ChronicleEditsLog(
                validatedChronicle.value.chronicle_id,
                "Create",
                "Website user",
                null,
                newInfo,
                DateTime.UtcNow
            );

            await _MyChroniclesLogger.LogChronicleEdits(edits);

            AlternativeTitles newAltTitle = new AlternativeTitles(
                validatedChronicle.value.title,
                validatedChronicle.value.chronicle_id,
                true,
                validatedChronicle.value.entertainment_category
            );

            await _MyChroniclesDb.addChronicle(validatedChronicle.value, newAltTitle);

            return Ok("successfully added");
        } else {
            return BadRequest(validatedChronicle.error);
        }
    }
    
    [HttpPost("update")]   
    public async Task<IActionResult> updateChronicle(ChronicleContractEdit chronicle) {        
        ErrorOr<string> updateChronicle = await _MyChroniclesDb.updateChronicleManually(chronicle);

        if (updateChronicle.error.Description == "No Error") {
            return Ok(updateChronicle.value);
        } else {
            return StatusCode(400, updateChronicle.error);
        }
        
    }       
}
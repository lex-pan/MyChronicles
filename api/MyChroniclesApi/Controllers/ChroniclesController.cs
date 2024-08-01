using Microsoft.AspNetCore.Mvc;
using MyChroniclesApi.Contracts.Urls;
using MyChroniclesApi.Models;
using MyChroniclesApi.ServiceErrors;
using MyChroniclesApi.Services;
namespace MyChroniclesApi.Controllers;
using MyChroniclesApi.Models.Chronicles;

[ApiController]
[Route("[controller]")]
public class ChroniclesController : ControllerBase {
    private readonly ChroniclesService _MyChroniclesDb;

    public ChroniclesController(ChroniclesService database) {
        _MyChroniclesDb = database;
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
 
}
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
}
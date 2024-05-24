using Microsoft.AspNetCore.Mvc;
using MyChroniclesApi.Contracts.Urls;
using MyChroniclesApi.Models;
using MyChroniclesApi.Services.Urls;
namespace MyChroniclesApi.Controllers;

[ApiController]
[Route("[controller]")]
public class UrlsController : ControllerBase {
    private readonly UrlsService _MyChroniclesDb;

    public UrlsController(UrlsService database) {
        _MyChroniclesDb = database;
    }

    [HttpPost()]
    public IActionResult CreateUrlDecipher(CreateUrlDecipher request) {
        var urlDecipher = new DecipherUrls(
            request.Domain,
            request.Title_start_end,
            request.Chapter_start_end,
            request.Entertainment_category,
            request.Selection_type,
            request.dom_selector
        );

        return Ok(request);
    }
    
    [HttpGet("{domain}")]
    public IActionResult GetUrlDecipher(string domain) {
        return Ok(domain);
    }

    [HttpPut("")]
    public IActionResult UpdateUrlDecipher(CreateUrlDecipher request) {
        return Ok(request);
    }

    [HttpDelete("{domain}")]
    public IActionResult DeleteUrlDecipher(string domain) {
        return Ok(domain);
    }
}
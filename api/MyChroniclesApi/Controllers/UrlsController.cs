using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.ObjectPool;
using MyChroniclesApi.Contracts.Urls;
using MyChroniclesApi.Models;
using MyChroniclesApi.Services.Urls;
namespace MyChroniclesApi.Controllers;

[ApiController]
[Route("[controller]")]
public class UrlsController : ControllerBase {
    private readonly IUrlsService _MyChroniclesDb;

    public UrlsController(IUrlsService database) {
        _MyChroniclesDb = database;
    }

    /*
    [HttpPost()]
    public async Task<IActionResult> CreateUrlDecipher(CreateUrlDecipher request) {
        List<DecipherSteps> title_instructions = instructionClass(request.Title_start_end);
        List<DecipherSteps> chapter_instructions = instructionClass(request.Chapter_start_end);
        List<DecipherSteps> entertainment_category_instructions = instructionClass(request.Entertainment_category);
       // DOMIdentifier dom_identifier = new DOMIdentifier(request.dom_selector[0], request.dom_selector[1], request.dom_selector[2]);


        var urlDecipher = new DecipherUrls(
            request.Domain,
            title_instructions,
            chapter_instructions,
            entertainment_category_instructions,
            request.Selection_type,
            dom_identifier
        );

        await _MyChroniclesDb.AddUrlDecipher(urlDecipher);
        
        return Ok(request);
    }
    */
    
    [HttpGet("{domain}")]
    public async Task<IActionResult> GetUrlDecipher(string domain) {
        var response = await _MyChroniclesDb.GetUrlDecipher(domain);
        Console.WriteLine(response);
        return Ok(response);
    }

    [HttpPut("")]
    public IActionResult UpdateUrlDecipher(CreateUrlDecipher request) {
        return Ok(request);
    }

    [HttpDelete("{domain}")]
    public async Task<IActionResult> DeleteUrlDecipher(string domain) {
        await _MyChroniclesDb.DeleteUrlDecipher(domain);
        return Ok(domain);
    }

    /*
    private List<DecipherSteps> instructionClass(List<List<string>> instructions) {
        List<DecipherSteps> modelledInstructions = new List<DecipherSteps>();

        for (int i = 0; i < instructions.Count; i++) {
            string selector = instructions[i][0];
            string start = instructions[i][1];
            string end = instructions[i][2];
            
            var instruction = new DecipherSteps(
                selector,
                start,
                end
            );

            modelledInstructions.Add(instruction);
        }        

        return modelledInstructions;
    } 
    */
}
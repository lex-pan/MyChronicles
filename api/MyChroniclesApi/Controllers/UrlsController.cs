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

    
    [HttpPost()]
    public async Task<IActionResult> CreateUrlDecipher(CreateUrlDecipher request) {
        List<DecipherUrlSteps> instructions = new List<DecipherUrlSteps>();

        instructions = instructionDbConversion(instructions, request.Domain, "title" , request.Title_start_end);
        instructions = instructionDbConversion(instructions, request.Domain, "chapter" , request.Chapter_start_end);
        instructions = instructionDbConversion(instructions, request.Domain, "entertainment" , request.Entertainment_category);

        string dom_string = "";
        for (int i = 0; i < request.dom_selector.Count; i++) {
            if (i == 0) {
                dom_string = dom_string + request.dom_selector[0];
            } else {
                dom_string = dom_string + " " + request.dom_selector[i];
            }
        }

        var urlDecipher = new Urls(
            request.Domain,
            request.Selection_type,
            dom_string
        );

        await _MyChroniclesDb.AddUrlDecipher(urlDecipher, instructions);
        
        return Ok(request);
    }
    
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
    
    private List<DecipherUrlSteps> instructionDbConversion(List<DecipherUrlSteps> instructionsList, string domain, string category, List<List<object>> instructions) {
        for (int i = 0; i < instructions.Count; i++) {
            string selector = instructions[i][0].ToString();
            string start = instructions[i][1].ToString();
            string end = instructions[i][1].ToString();
            
            var instruction = new DecipherUrlSteps(
                domain,
                category,
                i+1,           
                selector,
                Convert.ToInt32(start),
                Convert.ToInt32(end)
            );

            instructionsList.Add(instruction);
        }        

        return instructionsList;
    } 
}
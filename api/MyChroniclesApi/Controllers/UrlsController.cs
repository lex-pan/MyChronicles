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
        UrlsResult response = await _MyChroniclesDb.GetUrlDecipher(domain);
        List<List<List<object>>> instruction_categories = cleanInstructions(response.instructions);

        object[] domToObject = response.dom_selector.Split(' ');
        List<object> domToList = new List<object>(domToObject);
        domToList[2] = Convert.ToInt32(domToList[2]);
        
        UrlDecipherResponse understandableFormat = new UrlDecipherResponse(
            response.selection_type,
            instruction_categories[0],
            instruction_categories[1],
            instruction_categories[2],
            domToList
        );
        
        return Ok(understandableFormat);
    }

    [HttpPut("")]
    public async Task<IActionResult> UpdateUrlDecipher(CreateUrlDecipher request) {
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

        await _MyChroniclesDb.UpdateUrlDecipher(urlDecipher, instructions);
        
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
            string end = instructions[i][2].ToString();
            
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

    private List<List<List<object>>> cleanInstructions(List<DecipherUrlSteps> instructions) {
        List<List<StepsConversion>> categorized = new List<List<StepsConversion>>();
        List<List<List<object>>> sorted = new List<List<List<object>>>();

        for (int a = 0; a < 3; a++) {
            categorized.Add([]);
        }

        for (int i = 0; i < instructions.Count; i++) {
            StepsConversion instruction = new StepsConversion(
                instructions[i].step_number,
                instructions[i].word_to_find,
                instructions[i].word_start,
                instructions[i].word_end
            );

            switch (instructions[i].decipher_category) {
                case "title":
                    categorized[0].Add(instruction);
                    break;
                case "chapter":
                    categorized[1].Add(instruction);
                    break;
                case "entertainment":
                    categorized[2].Add(instruction);
                    break;
                default:
                    throw new ArgumentException($"Invalid input: {instructions[i]} does not have a proper category");
            }           
        }

        for (int b = 0; b < categorized.Count; b++) {
            categorized[b].Sort((stepOne, stepTwo) => stepOne.step_number.CompareTo(stepTwo.step_number));
        }

        for (int c = 0; c < categorized.Count; c++) {
            sorted.Add([]);
            for (int d = 0; d < categorized[c].Count; d++) {
                sorted[c].Add(categorized[c][d].instruction);
            }       
        }
        
        return sorted;
    }
}
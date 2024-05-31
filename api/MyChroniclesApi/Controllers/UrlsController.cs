using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.ObjectPool;
using MyChroniclesApi.Contracts.Urls;
using MyChroniclesApi.Models;
using MyChroniclesApi.ServiceErrors;
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
        ErrorOr<List<DecipherUrlSteps>> instructions = ErrorOr<List<DecipherUrlSteps>>.Success(new List<DecipherUrlSteps>());

        instructions = instructionDbConversion(instructions, request.domain, "title" , request.title_start_end);
        if (instructions.error != null) {
            return BadRequest(instructions.error);
        }
        instructions = instructionDbConversion(instructions, request.domain, "chapter" , request.chapter_start_end);
        if (instructions.error != null) {
            return BadRequest(instructions.error);
        }
        instructions = instructionDbConversion(instructions, request.domain, "entertainment" , request.entertainment_category);
        if (instructions.error != null) {
            return BadRequest(instructions.error);
        }

        var urlDecipher = Urls.Create(
            request.domain,
            request.decipher_method
        );

        if (urlDecipher.error == null) {
            await _MyChroniclesDb.AddUrlDecipher(urlDecipher.value, instructions.value);
        } else {
            return BadRequest(urlDecipher.error);
        }
        
        return Ok(request);
    }
    
    [HttpGet("{domain}")]
    public async Task<IActionResult> GetUrlDecipher(string domain) {
        ErrorOr<UrlsResult> response = await _MyChroniclesDb.GetUrlDecipher(domain);

        if (response == null) {
            return Ok();
        }

        UrlsResult toUrls = response.value;

        List<List<List<object>>> instruction_categories = cleanInstructions(toUrls.instructions);

        string[] domToObject = toUrls.decipher_method.Split(' ');
        List<string> domToList = new List<string>(domToObject);
        
        UrlDecipherResponse understandableFormat = new UrlDecipherResponse(
            domToList,
            instruction_categories[0],
            instruction_categories[1],
            instruction_categories[2]
        );
        
        return Ok(understandableFormat);
    }

    [HttpPut("")]
    public async Task<IActionResult> UpdateUrlDecipher(CreateUrlDecipher request) {
        ErrorOr<List<DecipherUrlSteps>> instructions = ErrorOr<List<DecipherUrlSteps>>.Success(new List<DecipherUrlSteps>());        

        instructions = instructionDbConversion(instructions, request.domain, "title" , request.title_start_end);
        if (instructions.error != null) {
            return BadRequest(instructions.error);
        }
        instructions = instructionDbConversion(instructions, request.domain, "chapter" , request.chapter_start_end);
        if (instructions.error != null) {
            return BadRequest(instructions.error);
        }
        instructions = instructionDbConversion(instructions, request.domain, "entertainment" , request.entertainment_category);
        if (instructions.error != null) {
            return BadRequest(instructions.error);
        }

        var urlDecipher = Urls.Create (
            request.domain,
            request.decipher_method
        );

        if (urlDecipher.error == null) {
            await _MyChroniclesDb.UpdateUrlDecipher(urlDecipher.value, instructions.value);
        } else {
            return BadRequest(urlDecipher.error);
        }

        return Ok(request);
    }

    [HttpDelete("{domain}")]
    public async Task<IActionResult> DeleteUrlDecipher(string domain) {
        await _MyChroniclesDb.DeleteUrlDecipher(domain);
        return Ok(domain);
    }
    
    private ErrorOr<List<DecipherUrlSteps>> instructionDbConversion(ErrorOr<List<DecipherUrlSteps>> instructionsList, string domain, string category, List<List<object>> instructions) {
        for (int i = 0; i < instructions.Count; i++) {
            string wordStart = instructions[i][0].ToString();
            string wordStartIndex = instructions[i][1].ToString();
            string wordStartAdjustment = instructions[i][2].ToString();
            string wordEnd = instructions[i][3].ToString();
            string wordEndIndex = instructions[i][4].ToString();
            string wordEndAdjustment = instructions[i][5].ToString();
            
            var instruction = DecipherUrlSteps.Create(
                domain,
                category,
                i+1,           
                wordStart,
                Convert.ToInt32(wordStartIndex),
                Convert.ToInt32(wordStartAdjustment),
                wordEnd,
                Convert.ToInt32(wordEndIndex),
                Convert.ToInt32(wordEndAdjustment)
            );
            
            if (instruction.error == null) {
                instructionsList.value.Add(instruction.value);
            } else {
                return ErrorOr<List<DecipherUrlSteps>>.Failure(instruction.error);
            }
        }        

        return ErrorOr<List<DecipherUrlSteps>>.Success(instructionsList.value);
    } 

    private List<List<List<object>>> cleanInstructions(List<DecipherUrlSteps> instructions) {
        List<List<List<object>>> categorized = new List<List<List<object>>>();

        for (int a = 0; a < 3; a++) {
            categorized.Add([]);
        }

        for (int i = 0; i < instructions.Count; i++) {
            List<object> instruction = [
                instructions[i].word_start, 
                instructions[i].word_start_index, 
                instructions[i].word_start_adjustment,
                instructions[i].word_end, 
                instructions[i].word_end_index, 
                instructions[i].word_end_adjustment
            ];

            switch (instructions[i].chronicle_info_category) {
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
        
        return categorized;
    }
}
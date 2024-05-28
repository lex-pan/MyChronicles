namespace MyChroniclesApi.Services.Urls;
using Microsoft.EntityFrameworkCore;
using MyChroniclesApi.Models;
using MyChroniclesApi.ServiceErrors;

public interface IUrlsService {
    DbSet<Urls> chronicle_extension_decipher { get; set; }
    DbSet<DecipherUrlSteps> decipher_steps { get; set; }
    Task<ErrorOr<string>> AddUrlDecipher(Urls urlModel, List<DecipherUrlSteps> instructions);
    Task<ErrorOr<UrlsResult>> GetUrlDecipher(string domain);
    Task<ErrorOr<string>> DeleteUrlDecipher(string domain);
    Task<ErrorOr<string>> UpdateUrlDecipher(Urls urlModel, List<DecipherUrlSteps> instructions);
}


namespace MyChroniclesApi.Services.Urls;
using Microsoft.EntityFrameworkCore;
using MyChroniclesApi.Models;

public interface IUrlsService {
    DbSet<Urls> chronicle_extension_decipher { get; set; }
    DbSet<DecipherUrlSteps> decipher_steps { get; set; }
    Task AddUrlDecipher(Urls urlModel, List<DecipherUrlSteps> instructions);
    Task<UrlsResult> GetUrlDecipher(string domain);
    Task<Urls> DeleteUrlDecipher(string domain);
    Task UpdateUrlDecipher(Urls urlModel, List<DecipherUrlSteps> instructions);
}
namespace MyChroniclesApi.Services.Urls;
using Microsoft.EntityFrameworkCore;
using MyChroniclesApi.Models;

public interface IUrlsService {
    DbSet<DecipherUrls> chronicle_extension_decipher { get; set; }
    Task AddUrlDecipher(DecipherUrls urlModel);
    Task<DecipherUrls> GetUrlDecipher(string domain);
    Task<DecipherUrls> DeleteUrlDecipher(string domain);
}
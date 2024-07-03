namespace MyChroniclesApi.Services;
using Microsoft.EntityFrameworkCore;
using MyChroniclesApi.Models.Urls;
using MyChroniclesApi.ServiceErrors;

public interface IUrlsService {
    Task<ErrorOr<string>> AddUrlDecipher(Urls urlModel, List<DecipherUrlSteps> instructions);
    Task<ErrorOr<UrlsResult>> GetUrlDecipher(string domain);
    Task<ErrorOr<string>> DeleteUrlDecipher(string domain);
    Task<ErrorOr<string>> UpdateUrlDecipher(Urls urlModel, List<DecipherUrlSteps> instructions);
}


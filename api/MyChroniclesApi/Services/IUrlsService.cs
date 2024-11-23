namespace MyChroniclesApi.Services;
using Microsoft.EntityFrameworkCore;
using MyChroniclesApi.Models.Urls;
using MyChroniclesApi.ServiceErrors;

public interface IUrlsService {
    Task<ErrorOr<string>> AddUrlDecipher(DomainDecipher urlModel, List<DecipherUrlSteps> instructions);
    Task<ErrorOr<UrlsResult>> GetUrlDecipher(string domain);
    Task<ErrorOr<string>> DeleteUrlDecipher(string domain);
    Task<ErrorOr<string>> UpdateUrlDecipher(DomainDecipher urlModel, List<DecipherUrlSteps> instructions);
    Task<ErrorOr<string>> CreateValidUrl(List<ValidUrls> regexUrls);
    Task<List<string>> RetrieveValidUrls();
}


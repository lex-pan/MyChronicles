using Microsoft.AspNetCore.Mvc;
using MyChroniclesApi.Contracts.Urls;
using MyChroniclesApi.Models;
using MyChroniclesApi.ServiceErrors;
using MyChroniclesApi.Services;
namespace MyChroniclesApi.Controllers;

[ApiController]
[Route("[controller]")]
public class ChroniclesController : ControllerBase {
    private readonly ChroniclesService _MyChroniclesDb;

    public ChroniclesController(ChroniclesService database) {
        _MyChroniclesDb = database;
    }

}
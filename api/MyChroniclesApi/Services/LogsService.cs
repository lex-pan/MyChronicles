namespace MyChroniclesApi.Services;
using Microsoft.EntityFrameworkCore;
using MyChroniclesApi.ServiceErrors;
using MyChroniclesApi.Models.Logs;

public class LogsService : MyChroniclesDbContext {
    public LogsService(DbContextOptions<MyChroniclesDbContext> options) : base(options) {
        
    }

    public async Task<ErrorOr<string>> LogChronicleEdits(ChronicleEditsLog editted_chronicle){
        await this.Set<ChronicleEditsLog>().AddAsync(editted_chronicle);
        await this.SaveChangesAsync();

        return ErrorOr<string>.Success("success");
    }
}
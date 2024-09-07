namespace MyChroniclesApi.Models.Logs;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class ChronicleEditsLog { 
    [Key]
    public Guid id { get; set; }
    public Guid chronicle_id { get; set; }  // no foreign key, because we can't reference a deleted chronicle
    public string action { get; set; } // Update, Edit, Delete, Create
    public string source { get; set; }  // which user changed it, or maybe it was from extension
    public ChronicleChanges changed_data { get; set; }
    public DateTime date_of_action { get; set; }
    public ChronicleEditsLog() {}
    public ChronicleEditsLog(Guid ChronicleId, string Action, string Source, ChronicleChanges CurrentData, DateTime DateOfAction) {
        id = Guid.NewGuid();
        chronicle_id = ChronicleId;
        action = Action;
        source = Source;
        changed_data = CurrentData;
        date_of_action = DateOfAction;
    }
}


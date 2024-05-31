using System.ComponentModel.DataAnnotations;
using MyChroniclesApi.Models;
using System.ComponentModel.DataAnnotations.Schema;
using MyChroniclesApi.ServiceErrors;

public class DecipherUrlSteps {
    [Key]
    public Guid id { get; set; }
    [ForeignKey("domain")] // Specify the foreign key property
    public string domain { get; set; }
    public string chronicle_info_category { get; set; }
    public int step_number { get; set; }
    public string word_start { get; set; }
    public int word_start_index { get; set; }
    public int word_start_adjustment { get; set; }
    public string word_end { get; set; }
    public int word_end_index { get; set; }
    public int word_end_adjustment { get; set; }
    public Urls urls {get; set;} 
    public DecipherUrlSteps() {}
    private DecipherUrlSteps(
        string Domain, 
        string ChronicleInfoCategory, 
        int StepNumber, 
        string WordStart, 
        int WordStartIndex, 
        int WordStartAdjustment,
        string WordEnd, 
        int WordEndIndex, 
        int WordEndAdjustment
        ) {
        id = Guid.NewGuid();
        domain = Domain;
        chronicle_info_category = ChronicleInfoCategory;
        step_number = StepNumber;
        word_start = WordStart;
        word_start_index = WordStartIndex;
        word_start_adjustment = WordStartAdjustment;
        word_end = WordEnd;
        word_end_index = WordEndIndex;
        word_end_adjustment = WordEndAdjustment;
    }

    public static ErrorOr<DecipherUrlSteps> Create(
        string Domain, 
        string ChronicleInfoCategory, 
        int StepNumber, 
        string WordStart, 
        int WordStartIndex, 
        int WordStartAdjustment,
        string WordEnd, 
        int WordEndIndex, 
        int WordEndAdjustment
    ) {
        if (Domain == "" || Domain == null) {
            return ErrorOr<DecipherUrlSteps>.Failure(Error.InvalidInput("", "domain can't be empty or null"));
        }

        if (ChronicleInfoCategory != "title" && ChronicleInfoCategory != "chapter" && ChronicleInfoCategory != "entertainment") {
            return ErrorOr<DecipherUrlSteps>.Failure(Error.InvalidInput("", "invalid decipher category"));
        }

        if (WordStartIndex < -2 || WordEndIndex < -2) {
            return ErrorOr<DecipherUrlSteps>.Failure(Error.InvalidInput("", "start or end must be greater than -3"));
        }

        DecipherUrlSteps step = new DecipherUrlSteps(Domain, ChronicleInfoCategory, StepNumber, WordStart, WordStartIndex, WordStartAdjustment, WordEnd, WordEndIndex, WordEndAdjustment);

        return ErrorOr<DecipherUrlSteps>.Success(step);
    }
}

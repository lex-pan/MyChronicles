using System.ComponentModel.DataAnnotations;
using MyChroniclesApi.Models;
using System.ComponentModel.DataAnnotations.Schema;
using MyChroniclesApi.ServiceErrors;

public class DecipherUrlSteps {
    [Key]
    public Guid id { get; set; }
    [ForeignKey("domain")] // Specify the foreign key property
    public string domain { get; set; }
    public string decipher_category { get; set; }
    public int step_number { get; set; }
    public string word_to_find { get; set; }
    public int word_start { get; set; }
    public int word_end { get; set; }
    public Urls urls {get; set;} 
    public DecipherUrlSteps() {}
    private DecipherUrlSteps(string Domain, string DecipherCategory, int StepNumber, string Word, int Start, int End) {
        id = Guid.NewGuid();
        domain = Domain;
        decipher_category = DecipherCategory;
        step_number = StepNumber;
        word_to_find = Word;
        word_start = Start;
        word_end = End;
    }

    public static ErrorOr<DecipherUrlSteps> Create(string Domain, string DecipherCategory, int StepNumber, string Word, int Start, int End) {
        if (Domain == "" || Domain == null) {
            return ErrorOr<DecipherUrlSteps>.Failure(Error.InvalidInput("", "domain can't be empty or null"));
        }

        if (DecipherCategory != "title" && DecipherCategory != "chapter" && DecipherCategory != "entertainment") {
            return ErrorOr<DecipherUrlSteps>.Failure(Error.InvalidInput("", "invalid decipher category"));
        }

        if (Start < 0) {
            return ErrorOr<DecipherUrlSteps>.Failure(Error.InvalidInput("", "start must be positive or zero"));
        }

        DecipherUrlSteps step = new DecipherUrlSteps(Domain, DecipherCategory, StepNumber, Word, Start, End);

        return ErrorOr<DecipherUrlSteps>.Success(step);
    }
}

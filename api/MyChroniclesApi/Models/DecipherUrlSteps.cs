using System.ComponentModel.DataAnnotations;
using MyChroniclesApi.Models;
using System.ComponentModel.DataAnnotations.Schema;

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
    public DecipherUrlSteps(string Domain, string DecipherCategory, int StepNumber, string Word, int Start, int End) {
        id = Guid.NewGuid();
        domain = Domain;
        decipher_category = DecipherCategory;
        step_number = StepNumber;
        word_to_find = Word;
        word_start = Start;
        word_end = End;
    }
}

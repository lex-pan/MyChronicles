using System.ComponentModel.DataAnnotations;
using MyChroniclesApi.Models;
using System.ComponentModel.DataAnnotations.Schema;

public class DecipherSteps {
    [ForeignKey("domain")] // Specify the foreign key property
    public string domain { get; set; }
    public string decipher_category { get; set; }
    public int step_number { get; set; }
    public string word_to_find { get; set; }
    public int word_start { get; set; }
    public int word_end { get; set; }
    public DecipherUrls DecipherUrls { get; set; } // allows you to access an DecipherUrls object from DecipherSteps

    public DecipherSteps() {}
    public DecipherSteps(string Domain, string DecipherCategory, int StepNumber, string Word, int Start, int End) {
        domain = Domain;
        decipher_category = DecipherCategory;
        step_number = step_number;
        word_to_find = Word;
        word_start = Start;
        word_end = End;
    }
}

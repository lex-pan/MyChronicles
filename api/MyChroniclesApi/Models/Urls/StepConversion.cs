namespace MyChroniclesApi.Models;
public class StepsConversion {
    public int step_number { get; set; }
    public List<object> instruction { get; set; }
    public StepsConversion(int Step, string Selector, int Start, int End) {
        step_number = Step;
        instruction = [Selector, Start, End];
    }
}
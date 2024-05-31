namespace MyChroniclesApi.Models;

public class Chronicles() {
    public Guid id { get; set; }
    public string title { get; set; }
    public string author { get; set; }
    public string entertainment_category { get; set; }
    public int chapters { get; set; }
    public int episodes { get; set; }
    public int length { get; set; }
    public DateTime creation_date { get; set; }
    public string language { get; set; }
    public string country { get; set; }
}
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class DOMIdentifier {
    [ForeignKey("domain")] // Specify the foreign key property
    public string domain { get; set; }
    public string tag { get; set; }
    public string title { get; set; }
    public int index { get; set; }
    public DOMIdentifier() {}
    public DOMIdentifier(string Domain, string Tag, string Title, int Index) {
        domain = Domain;
        tag = Tag;
        title = Title;
        index = Index;
    }
}
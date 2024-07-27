namespace MyChroniclesApi.Models.Users;

public class RetrievedUserHistory {
    public string title { get; set; }
    public int chapter { get; set; }
    public string action { get; set; }
    public string url { get; set; }
    public DateTime date_of_action { get; set; }

    public RetrievedUserHistory(string Title, int Chapter, string Action, string Url, DateTime DateOfAction) 
    {
        title = Title;
        chapter = Chapter;
        action = Action;
        url = Url;
        date_of_action = DateOfAction;
    }
}
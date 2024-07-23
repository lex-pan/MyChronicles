namespace MyChroniclesApi.Models.Users;

public class UserProfileHistory {
    public string title { get; set; }
    public string action { get; set; }
    public DateTime occurence { get; set; }
    public float episode { get; set; }
    public UserProfileHistory(
        string Title,
        string Action,
        DateTime Occurence,
        float Episode
    ) 
    {
        title = Title;
        action = Action;
        occurence = Occurence;
        episode = Episode;
    }
}
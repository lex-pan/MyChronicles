namespace MyChroniclesApi.Models.Users;

public class RetrievedUserProfile {
    public DateTime last_online { get; set; }
    public DateTime date_joined { get; set; }
    public int watched_or_read { get; set; }
    public float? avg_rating { get; set; }
    public string bio { get; set; }
    public List<UserProfileHistory> user_history { get; set; }

    public RetrievedUserProfile(
        DateTime LastOnline,
        DateTime DateJoined,
        int WatchedRead,
        float? AvgRating,
        string Bio,
        List<UserProfileHistory> UserHistory
    ) 
    {
        last_online = LastOnline;
        date_joined = DateJoined;
        watched_or_read = WatchedRead;
        avg_rating = AvgRating;
        bio = Bio;
        user_history = UserHistory;
    }
}
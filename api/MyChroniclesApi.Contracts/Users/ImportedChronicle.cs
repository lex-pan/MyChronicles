namespace MyChroniclesApi.Contracts.Users;
public record ImportedChronicle(
    string title,
    string category,
    float num_episodes,
    float episodes_watched,
    float user_rating,
    string user_start_date,
    string user_last_watched,
    string user_status,
    string comments 
);
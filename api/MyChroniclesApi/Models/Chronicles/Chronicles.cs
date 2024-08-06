namespace MyChroniclesApi.Models.Chronicles;
using System.ComponentModel.DataAnnotations;
using MyChroniclesApi.ServiceErrors;
using MyChroniclesApi.Models.Chronicles;
using MyChroniclesApi.Contracts.Chronicles;

public class Chronicles {
    [Key]
    public Guid chronicle_id { get; set; }
    public string title { get; set; }
    public string? author { get; set; }
    public string? entertainment_category { get; set; }
    public float? episodes { get; set; }
    public string? length { get; set; }
    public string? language { get; set; }
    public string? country { get; set; }
    public int? members { get; set; }
    public float? rating { get; set; }
    public string? status { get; set; }
    public DateTime? start_date { get; set; }
    public DateTime? end_date { get; set; }
    public string? synopsis { get; set; }
    public DateTime? db_add_date { get; set; }
    public string? detailed_summary { get; set; }
    public Chronicles() {}
    private Chronicles(
            string Title, 
            string Author = null, 
            string EntertainmentCategory = null, 
            float? Episodes = null, 
            string? Length = null, 
            string Language = null, 
            string Country = null,
            int? Members = null,
            float? Rating = null,
            string Status = null,
            DateTime? Started = null,
            DateTime? Ended = null,
            string Synopsis = null   
        ) 
    {
        chronicle_id = Guid.NewGuid();
        title = Title;
        author = Author;
        entertainment_category = EntertainmentCategory;
        episodes = Episodes;
        length = Length;
        language = Language;
        country = Country;
        db_add_date = DateTime.UtcNow;
        members = Members;
        rating = Rating;
        status = Status;
        start_date = Started;
        end_date = Ended;
        synopsis = Synopsis;
    }

    public static ErrorOr<Chronicles> CreateAutomatic(string title, string entertainment_category) {
        if (title.Length < 1) {
            return ErrorOr<Chronicles>.Failure(Error.InvalidInput("", "Title can't be empty"));
        } 

        return ErrorOr<Chronicles>.Success(new Chronicles(Title: title, EntertainmentCategory: entertainment_category));
    }

    public static ErrorOr<Chronicles> AddManual(NewChronicle chronicle) {
        if (chronicle.title.Length < 1 || chronicle.synopsis.Length < 1) {
            return ErrorOr<Chronicles>.Failure(Error.InvalidInput("", "A title and synopsis must be provided"));
        }   

        ErrorOr<DateTime> start_date = convertStringToDate(chronicle.start_date);
        ErrorOr<DateTime> end_date = convertStringToDate(chronicle.end_date);

        if (start_date.error.Description != "No Error" || end_date.error.Description != "No Error") {
            return ErrorOr<Chronicles>.Failure(Error.InvalidInput("", "Invalid start or end date provided"));
        }

        Chronicles validChronicle = new Chronicles(
            Title: chronicle.title,
            Author: chronicle.author,
            EntertainmentCategory: chronicle.category,
            Episodes: chronicle.episodes,
            Length: chronicle.length,
            Country: chronicle.country,
            Status: chronicle.status,
            Started: start_date.value,
            Ended: end_date.value,
            Synopsis: chronicle.synopsis

        );

        return ErrorOr<Chronicles>.Success(validChronicle);
    }

    private static ErrorOr<DateTime> convertStringToDate(string stringDate) {
        DateTime convertedDate;

        if (stringDate == "") {
            convertedDate = new DateTime(1, 1, 1);
        } else {
            bool successfulConversion = DateTime.TryParse(stringDate, out convertedDate);

            if (!successfulConversion) {
                return ErrorOr<DateTime>.Failure(Error.InvalidInput("", "Date provided is not valid"));
            }
        }

        return ErrorOr<DateTime>.Success(convertedDate);
    }
}
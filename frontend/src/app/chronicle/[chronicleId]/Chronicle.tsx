// main page 
// displays title, synopsis, stats, character

interface extraData{
    genres: [],
    tags: [],
    alternative_titles: [],
    reviews: [],
    summary: string
};

interface extraDataProps{
    extraData: extraData
};

export default function Chronicle({extraData}: extraDataProps) {
    console.log("hello");
    console.log(extraData);
    return (
        <div className="chronicle-page">
            <h1>Player Who Returned 10,000 Years Later</h1>
            <div className="stats-general">
                <p>Members</p>
                <p>Rating</p>
                <p>Category</p>
                <p>Status</p>
                <p>Country</p>
                <p>Author</p>
                <p>Time Period</p>
                <p>Episodes</p>
            </div>
            <p className="synopsis">
            </p>
            <div className="stats-detailed">
                <p>Genre</p>
                <ul className="chronicle-attribute-list">
                    {extraData.genres.length > 0 && extraData.genres.map((genre, index) =>
                            <li key={index}>{genre}</li>
                    )}
                </ul>
                <p>Tags</p>
                <ul className="chronicle-attribute-list">
                    {extraData.tags.length > 0 && extraData.tags.map((tag, index) =>
                            <li key={index}>{tag}</li>
                    )}
                </ul>
                <p>Creators</p>
                <p>Alternative Titles</p>
                <ul className="chronicle-attribute-list">
                    {extraData.alternative_titles.length > 0 && extraData.alternative_titles.map((alt_title, index) =>
                            <li key={index}>{alt_title}</li>
                    )}
                </ul>
            </div>
            <div className="characters">

            </div>

            
        </div>
    )
}
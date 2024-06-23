// should include a search bar and beneath it, a bunch of filters

export default function Search() {
    return (
      <div className="search-page">
        <div className="filter-search-options">
          <input className="filter-search-bar" placeholder="search-bar"></input>
        </div>
        <div className="search-results">
          <div className="search-results-attributes">
            <p>Title</p>
            <p>Score</p>
            <p>Members</p>
            <p>Episodes</p>
            <p>Category</p>
            <p>Year</p>
          </div>
          <div className="searched-chronicle">
            <p>book one</p>
            <p>5</p>
            <p>348,576</p>
            <p>32</p>
            <p>Novel</p>
            <p>Apr 2024</p>
          </div>
          <div className="searched-chronicle">
            <p>book one</p>
            <p>5</p>
            <p>348,576</p>
            <p>32</p>
            <p>Novel</p>
            <p>Apr 2024</p>
          </div>
          <div className="searched-chronicle">
            <p>book one</p>
            <p>5</p>
            <p>348,576</p>
            <p>32</p>
            <p>Novel</p>
            <p>Apr 2024</p>
          </div>
          <div className="searched-chronicle">
            <p>book one</p>
            <p>5</p>
            <p>348,576</p>
            <p>32</p>
            <p>Novel</p>
            <p>Apr 2024</p>
          </div>
        </div>
      </div>
    );
  }

  /*
          <div className="category">
            <p>Categories</p>
            <div className="category-options">
              <input type="checkbox" id="All"/>
              <label htmlFor="All">All</label>
              <input type="checkbox" id="Novels"/>
              <label htmlFor="Novels">Novels</label>
              <input type="checkbox" id="Graphic Novels"/>
              <label htmlFor="Graphic Novels">Graphic Novels</label>
              <input type="checkbox" id="Films"/>
              <label htmlFor="Films">Films</label>
              <input type="checkbox" id="Shows"/>
              <label htmlFor="Shows">Shows</label>
            </div>
          </div>
          <div className="sort-by">
              <div className="sort-by-categories"></div>
              <div className="sort-by-time-range"></div>
              <div className="sort-up-down"></div>
          </div>
          <div className="search-countries">
            <label htmlFor="search-countries">Countries</label>
            <input list="countries" name="search-countries" id="search-countries"/>
            <datalist id="countries">
              <option value="United States">United States</option>
            </datalist>
          </div>
          <input placeholder="Year, ex: 2019-2024"/>
          <div className="search-tags">
            <p>Tags</p>
            <input className="search-tags-input"></input>
            <div className="search-tags-options"></div>
          </div>
          <div className="search-genre">
            <p>Genre</p>
            <input className="search-tags-genre"></input>
            <div className="search-genre-options"></div>
          </div>
        </div>
        <div>
          <p>Episodes</p>
          <input placeholder="min"/>
          <input placeholder="max"/>
        </div>
  
  */

/* multiple tags/genre are displayed on each line, when user searches it filters down, probably map tags */

// should include a search bar and beneath it, a bunch of filters
// consider different layouts such as display stats and synopsis together
// implement one that allows users to view image (when i get logistics down) 

'use client'
import React, { useState, useEffect, useRef } from "react";
import { GeneralSearchedChronicleInfo } from "../utils/interfaces";
import { debounce } from "../utils/convenientFunctions";
import SearchedChronicle from "./SearchedChronicle";
import AddChronicleOverlay from "../utils/Components/AddChronicleOverlay";
import { useAppSelector, useAppDispatch } from "@/globalRedux/hooks";
import { saveSearchQueries } from "@/globalRedux/features/Chronicles/ChroniclesQuerySlice";
import apiLink from '@/app/utils/apiLink';

export default function Search({defaultSearchResults} : {defaultSearchResults : Array<GeneralSearchedChronicleInfo>}) {
  let searchPageNumber= useRef(0);
  let queryString = useRef("");
  let semaphore = useRef(true);
  let remainingSearch = useRef(true);
  const savedSearchQueries = useAppSelector(state => state.SearchQueries.queried_chronicles);
  let [searchResults, setSearchResults] = useState<Array<GeneralSearchedChronicleInfo>>(savedSearchQueries ? savedSearchQueries : defaultSearchResults);
  const dispatch = useAppDispatch();

  const [toggleAddChronicles, setToggleAddChronicles] = useState(false);
  const [chronicleToBeAdded, setChronicleToBeAdded] = useState<GeneralSearchedChronicleInfo | null>();
  
  function toggle(chronicleToAdd: GeneralSearchedChronicleInfo | null) {
      setChronicleToBeAdded(chronicle => chronicleToAdd);
      setToggleAddChronicles(value => !value);
  }

  useEffect(() => {
    async function onscroll() {
        if (window.scrollY + window.innerHeight == document.body.scrollHeight && remainingSearch.current && semaphore.current) {
            semaphore.current = false;
            searchPageNumber.current = searchPageNumber.current + 1;
            let result : Array<GeneralSearchedChronicleInfo> = await sendAdvancedQueryToDb();
            setSearchResults(previousSearch => [...previousSearch, ...result]);                
          
            if (result.length < 50) {
                remainingSearch.current = false;
            }
        }

        semaphore.current = true;
    }

    window.addEventListener("scroll", onscroll);

    return () => {
      window.removeEventListener('scroll', onscroll);
  };
}, []);

  async function newSearch(e: React.ChangeEvent<any>) {
    console.log(e.target.value);
    if (e.target.value == "" || e.target.value == queryString) {
      return
    }

    queryString.current = e.target.value;
    let newSearchResults = await sendAdvancedQueryToDb();
    console.log(newSearchResults);
    searchPageNumber.current = 0;
    setSearchResults(previousSearch => newSearchResults);
  }

  async function sendAdvancedQueryToDb() {

    const searchResults = await fetch(`${apiLink}/chronicles/detailed-query/${queryString.current}/${searchPageNumber.current}`, {
      method: 'GET',
      headers: {
          'Accept': 'application/text' // Example: Accept JSON responses
      },
    });

    let jsonifiedSearchResults : Array<GeneralSearchedChronicleInfo> = await searchResults.json();
    return jsonifiedSearchResults;
  }

  const debouncedQuery = debounce((e) => newSearch(e));

  function queriesForBack() {
    dispatch(saveSearchQueries(searchResults));
  }

  return (
    <div className="search-page">
      {toggleAddChronicles && chronicleToBeAdded != null &&
        <AddChronicleOverlay chronicle={chronicleToBeAdded} toggle={toggle}/>
      }
      <div className="filter-search-options">
        <input className="filter-search-bar" placeholder="search-bar" onKeyUp={(e) => debouncedQuery(e)}></input>
      </div>
      <div className="search-results">
        {searchResults.map((chronicle, index) => (
          <SearchedChronicle key={index} chronicle={chronicle} toggleAdd={toggle} queriesForBack={queriesForBack}/>
        ))}
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

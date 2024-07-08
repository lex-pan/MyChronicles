import React, { useState } from "react";
import AddChronicle from "./AddChronicle";
import { searchChroniclePageProps, AddChronicleInfo } from "@/app/utils/interfaces";

export default function AddChroniclesPage({toggle} : searchChroniclePageProps) {
    
    // call api to retrieve results 
    let searchResults : Record<number, AddChronicleInfo> = {
        67: {
            chronicle_id: 67, 
            title: "book 1",
            category: "Novel",
            year: "2024"
        }, 
        33: {
            chronicle_id: 33, 
            title: "book 2",
            category: "Novel",
            year: "2024"
        }, 
        95: {
            chronicle_id: 95, 
            title: "some comic",
            category: "Graphic Novel",
            year: "2024"
        }, 
        109: {
            chronicle_id: 109, 
            title: "show 1",
            category: "Show",
            year: "2024"
        }, 
        86: {
            chronicle_id: 86, 
            title: "film 1",
            category: "Film",
            year: "2024"
        }, 
        28: {
            chronicle_id: 28, 
            title: "comic 2",
            category: "Graphic Novel",
            year: "2024"
        }, 
        49: {
            chronicle_id: 49, 
            title: "show 30",
            category: "Show",
            year: "2024"
        }
    }

    const [searchedChronicles, setSearchedChronicles] = useState(sortSearchedChronicles());

    function sortSearchedChronicles() {
        let reads : Array<AddChronicleInfo> = [];
        let watches : Array<AddChronicleInfo> = [];

        Object.keys(searchResults).forEach(key => {
            const numericKey = parseInt(key, 10); // Parse key to integer
            if (searchResults[numericKey].category == "Novel" || searchResults[numericKey].category == "Graphic Novel") {
                reads.push(searchResults[numericKey]);
            } else {
                watches.push(searchResults[numericKey]);
            }
        });

        return [reads, watches]
    }
    
    // returns a function
    // ...args is what is passed to the function we want to call after user finishes typing check processSearch for what inputs we give
    // timer is an id and clearTimeout will get rid of timer if a new one is invoked
    // the function knows about the previous timer because closures allow the returned function to still have access to the timer in debounce
    function debounce(searchDb : (e : React.ChangeEvent<any>) => void, timeout = 700){
        let timer: ReturnType<typeof setTimeout>;
        return (e : React.ChangeEvent<any>) => {
          clearTimeout(timer);
          timer = setTimeout(() => { searchDb(e); }, timeout);
        };
    }

    function saveInput(e : React.ChangeEvent<any>){
        console.log(e.target.value);
        let queryString = e.target.value;
        // once db is set up, send queryString to db to fetch search results
    }

    // by setting processSearch to debounce(), everytime processSearch is shown it'd call debounce()
    // in the onkeyup, because we use processSearch() the return function will be called because 
    // it'd be equivalent to debounce()(). where debounce() is the result and we call the function of the result debounce()()
    const processSearch = debounce((e) => saveInput(e));      

    return ( 
        <div className="overlay">
            <div className='add-chronicles-page'>
                <div className='add-chronicles-options'>
                    <input className='add-chronicles-search' onKeyUp={(e) => processSearch(e)} placeholder='search bar'></input>
                    <button className='close-chronicles-options' onClick={toggle}></button>
                </div>
                <div className='add-chronicles-section-container'>
                    <div className='add-chronicles-section'>
                        <h1>Novels/Graphic Novels</h1>
                        <div className='add-section-attributes'>
                            <p>Title</p>
                            <p>Category</p>
                            <p>Year</p>
                        </div>
                        <div className='add-chronicles-content'>
                            {searchedChronicles[0].map(item => (
                                <AddChronicle key={item.chronicle_id} searched_chronicle={item}/>
                            ))}
                        </div>    
                    </div>
                    <div className='add-chronicles-section'>
                        <h1>Films/Shows</h1>
                        <div className='add-section-attributes'>
                            <p>Title</p>
                            <p>Category</p>
                            <p>Year</p>
                        </div>
                        <div className='add-chronicles-content'>
                            {searchedChronicles[1].map(item => (
                                <AddChronicle key={item.chronicle_id} searched_chronicle={item}/>
                            ))}
                        </div>    
                    </div>
                </div>
            </div>
        </div>
    );
}
  
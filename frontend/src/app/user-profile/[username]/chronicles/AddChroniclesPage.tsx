import React, { useRef, useState } from "react";
import AddChronicleItem from "./AddChronicleItem";
import { searchChroniclePageProps, AddChronicleInfo } from "@/app/utils/interfaces";

export default function AddChroniclesPage({toggle, setCategorizedChronicles, sortByStatus, profileUC} : searchChroniclePageProps) {
    const [searchedChronicles, setSearchedChronicles] = useState(() => sortSearchedChronicles([]));

    function sortSearchedChronicles(searchResults: Array<AddChronicleInfo>) {
        let reads : Array<AddChronicleInfo> = [];
        let watches : Array<AddChronicleInfo> = [];

        for (let i = 0; i < searchResults.length; i++) {
            console.log(searchResults[i]);
            console.log(searchResults[i].entertainment_category);
            if (searchResults[i].entertainment_category == "Novel" || searchResults[i].entertainment_category == "Graphic Novel") {
                reads.push(searchResults[i]);
            } else {
                watches.push(searchResults[i]);
            }
        }

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

    async function saveInput(e : React.ChangeEvent<any>){
        console.log(e.target.value);
        let queryString = e.target.value;
        // once db is set up, send queryString to db to fetch search results
        const data = await chroniclesQuery(queryString);
        console.log(data);

        setSearchedChronicles(sortSearchedChronicles(data));
    }

    async function chroniclesQuery(queryString: string) {
        console.log("querying chronicles");
        const request = await fetch(`http://localhost:5172/chronicles/query/${queryString}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/text' // Example: Accept JSON responses
            }
        });
        
        return request.json()
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
                                <AddChronicleItem key={item.chronicle_id} searched_chronicle={item} setCategorizedChronicles={setCategorizedChronicles} sortByStatus={sortByStatus} profileUC={profileUC}/>
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
                                <AddChronicleItem key={item.chronicle_id} searched_chronicle={item} setCategorizedChronicles={setCategorizedChronicles} sortByStatus={sortByStatus} profileUC={profileUC}/>
                            ))}
                        </div>    
                    </div>
                </div>
            </div>
        </div>
    );
}
  
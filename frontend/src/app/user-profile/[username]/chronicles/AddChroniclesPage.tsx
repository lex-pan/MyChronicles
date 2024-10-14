import React, { useRef, useState } from "react";
import AddChronicleItem from "./AddChronicleItem";
import { searchChroniclePageProps, AddChronicleInfo } from "@/app/utils/interfaces";
import { debounce } from "@/app/utils/convenientFunctions";
import apiLink from '@/app/utils/apiLink';

export default function AddChroniclesPage({toggle, setCategorizedChronicles, sortUC, profileUC} : searchChroniclePageProps) {
    const [searchedChronicles, setSearchedChronicles] = useState<Array<AddChronicleInfo>>([]);

    async function saveInput(e : React.ChangeEvent<any>){
        console.log(e.target.value);
        let queryString = e.target.value;
        // once db is set up, send queryString to db to fetch search results
        if (queryString != "") {
            const data = await chroniclesQuery(queryString);
            console.log(data);
    
            setSearchedChronicles(data);
        }
    }

    async function chroniclesQuery(queryString: string) {
        console.log("querying chronicles");
        const request = await fetch(`${apiLink}/chronicles/query/${queryString}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/text' // Example: Accept JSON responses
            }
        });
        
        const result = await request.json();
        return result;
    }

    // by setting processSearch to debounce(), everytime processSearch is shown it'd call debounce()
    // in the onkeyup, because we use processSearch() the return function will be called because 
    // it'd be equivalent to debounce()(). where debounce() is the result and we call the function of the result debounce()()
    const processSearch = debounce((e) => saveInput(e));      

    return ( 
        <div className="overlay">
            <div className='overlay-container add-chronicles-page'>
                <div className='add-chronicles-options'>
                    <input className='add-chronicles-search' onKeyUp={(e) => processSearch(e)} placeholder='search bar'></input>
                    <button className='close-chronicles-options' onClick={toggle}></button>
                </div>
                <div className='add-chronicles-section-container'>
                    <div className='add-chronicles-section'>
                        <h1>Chronicles</h1>
                        <div className='add-section-attributes'>
                            <p>Title</p>
                            <p>Category</p>
                            <p>Date</p>
                        </div>
                        <div className='add-chronicles-content'>
                            {searchedChronicles.map(item => (
                                <AddChronicleItem key={item.chronicle_id} searched_chronicle={item} setCategorizedChronicles={setCategorizedChronicles} sortUC={sortUC} profileUC={profileUC}/>
                            ))}
                        </div>    
                    </div>
                </div>
            </div>
        </div>
    );
}
  
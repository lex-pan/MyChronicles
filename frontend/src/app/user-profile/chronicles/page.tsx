/*
Future ToDo's for this section
    - data caching and modification when user decides to change it 
    - implement db actions for chronicles request, delete, update
    - QOL filter actions on chronicles
    - different ways to categorize chronicles 

To-Do's I can implement right now:
    - add function
*/

"use client";
import { InputHTMLAttributes, useEffect, useState } from 'react';
import { MouseEvent } from 'react';
import StatusContainer from './StatusContainer';
import AddChronicle from './AddChroniclesPage';
import AddChroniclesPage from './AddChroniclesPage';
export default function ChronicleCategoryLayout() {

    // retrieve entries from db 
    let UserChronicles : Record<number, UserChronicle> = {
        37: {
            userChronicleId: 37,
            bookId: 1,
            title: "Harry Potter and the deathly hallows ",
            rating: 4, // Just an example rating
            start_date: "2021-04-22", // Current date as an example
            last_read: "2023-04-22", // Example last read date
            episode: 10, // Example chapter
            img_src: "https://example.com/harry.jpg", // Example image URL
            review: "this is a great book",
            notes: "Harry is very hairy will reread 10/10", // Example notes
            category: "Novel", // Example category
            status: "Reading" // Example status
        },
        48: {
            userChronicleId: 48,
            bookId: 2,
            title: "Example Title",
            rating: 5, // Just an example rating
            start_date: "2023-02-22", // Current date as an example
            last_read: "2023-02-28", // Example last read date
            episode: 20, // Example chapter
            img_src: "https://example.com/example.jpg", // Example image URL
            review: "a masterpiece of its time",
            notes: "This book is amazing!", // Example notes
            category: "Graphic Novel", // Example category
            status: "Completed" // Example status
        },
        127: {
            userChronicleId: 127,
            bookId: 3,
            title: "Another Example",
            rating: 4, // Just an example rating
            start_date: "2020-04-22", // Current date as an example
            last_read: "2023-01-10", // Example last read date
            episode: 15, // Example chapter
            img_src: "https://example.com/another-example.jpg", // Example image URL
            review: "I mean it's very enjoyable",
            notes: "Enjoyed reading this one", // Example notes
            category: "Graphic Novel", // Example category
            status: "Completed" // Example status
        },
        506: {
            userChronicleId: 506,
            bookId: 4,
            title: "Sun Zhu - The Art of Testing",
            rating: 3, // Just an example rating
            start_date: "2022-08-22", // Current date as an example
            last_read: "2023-03-15", // Example last read date
            episode: 5, // Example chapter
            img_src: "https://example.com/default.jpg", // Example image URL
            review: "Subduing the mind through a good book - Sun Zhu",
            notes: "Good book so far", // Example notes
            category: "Film", // Example category
            status: "Reading" // Example status
        }
    }

    let listOfChanges : Record<number, any> = {};

    useEffect(() => {
        
        window.onbeforeunload = function(event)
        {
            console.log(listOfChanges);
        };

        return () => {
            // send to db and cached for change
            console.log(listOfChanges);
        }
    });

    // call function to get user's entries 
    // retrieve data from session storage
    const [chronicleStatus, setChronicleStatus] = useState(["Reading", "Completed", "Rereading", "Plan To Read", "Paused", "Dropped"]);
    const [categorizedChronicles, setCategorizedChronicles] = useState<Array<Array<UserChronicle>>>(sortByStatus(UserChronicles));
    const [toggleAddChronicles, setToggleAddChronicles] = useState(false);
    
    function sortByStatus(filteredChronicles: Record<number, UserChronicle>) {
        let newArray : any[] = [];
        let statusMap: {[key: string]: number} = {};
        for (let i = 0; i < chronicleStatus.length; i++) {
            newArray.push([]);
            statusMap[chronicleStatus[i]] = i;
        }

        for (const key in filteredChronicles) {
            const chronicle = filteredChronicles[key];
            const status = chronicle.status;
            const index = statusMap[status];
            newArray[index].push(chronicle);
        }

        return newArray;
    }

    function cssFolderEffect(e: MouseEvent<HTMLDivElement, Event>, index: number) {
        const chronicleOptions = e?.currentTarget.parentNode;
        if (chronicleOptions && chronicleOptions.children) {
            for (let i = 0; i < chronicleOptions?.children.length; i++ && e.currentTarget.firstChild) {
                if (index == i) {
                    chronicleOptions?.children[i].classList.add('selected-chronicle-category'); 
                } else {
                    chronicleOptions?.children[i].classList.remove('selected-chronicle-category'); 
                }
            }
        } else {
            console.log("error selecting css");
        }
    }

    function filterUserChronicles(entertainment_category : string) {
        let desiredMedium : Record<number, UserChronicle> = {};

        Object.keys(UserChronicles).forEach(key => {
            const numericKey = parseInt(key, 10); // Parse key to integer
            if (UserChronicles[numericKey].category == entertainment_category) {
                desiredMedium[numericKey] = UserChronicles[numericKey];
            }
        });

        return desiredMedium
    }

    function filterChroniclesByMedium(mediumType: string) {
        switch(mediumType){
            case 'Novels':
                const novelsOnly : Record<number, UserChronicle> = filterUserChronicles("Novel");
                return novelsOnly;
            case 'Graphic Novels':
                const graphicNovelsOnly : Record<number, UserChronicle> = filterUserChronicles("Graphic Novel");
                return graphicNovelsOnly;
            case 'Films':
                const filmsOnly : Record<number, UserChronicle> = filterUserChronicles("Film");
                return filmsOnly;
            case 'Shows':
                const showsOnly : Record<number, UserChronicle> = filterUserChronicles("Show");
                return showsOnly;
            default: 
                return UserChronicles;
        }
    }

    function mediumChange(e: MouseEvent<HTMLDivElement, Event>, index: number, medium: string) {
        cssFolderEffect(e, index);
        let filteredChronicles = filterChroniclesByMedium(medium);
        let sortedChronicles = sortByStatus(filteredChronicles);
        setCategorizedChronicles(sortedChronicles);
    }

    function searchChronicleTitles(e : React.ChangeEvent<HTMLInputElement>) {
        let searchResults : Record<number, UserChronicle> = {};

        console.log(e.target.value);
        let searchText = e.target.value;
        
        Object.keys(UserChronicles).forEach(key => {
            const numericKey = parseInt(key);
            if (UserChronicles[numericKey].title.toLowerCase().includes(searchText.toLowerCase())) {
                searchResults[numericKey] = UserChronicles[numericKey];
            }
        })

        let sortedChronicles = sortByStatus(searchResults);
        setCategorizedChronicles(sortedChronicles);
    }

    function openAddChroniclesTab() {
        setToggleAddChronicles(value => !value);
    }

  // when users edit, save changes to session storage
  // when the user closes the browser/reloads the browser update the database 
  return (
    <div className='chronicles-section'>
        <div className='chronicle-category-options'>
            <div className='chronicle-category-option selected-chronicle-category' onClick={(e) => mediumChange(e, 0, "")}>
                <p className=''>All</p>
            </div>
            <div className='chronicle-category-option' onClick={(e) => mediumChange(e, 1, "Novels")}>
                <p className=''>Novels</p>
            </div>
            <div className='chronicle-category-option' onClick={(e) => mediumChange(e, 2, "Graphic Novels")}>
                <p className=''>Graphic Novels</p>
            </div>
            <div className='chronicle-category-option' onClick={(e) => mediumChange(e, 3, "Films")}>
                <p className=''>Films</p>
            </div>
            <div className='chronicle-category-option' onClick={(e) => mediumChange(e, 4, "Shows")}>
                <p className=''>Shows</p>
            </div>
        </div>
        <div className='sidebar-options'>
        </div>
        <div className='user-container'>            
            <div className='user-chronicle-filters'>
                <input className='user-chronicle-filters-search' placeholder='search bar' onChange={searchChronicleTitles}></input>
                <button className='user-chronicle-filters-button' onClick={openAddChroniclesTab}>Add Chronicle</button>
                <div className='filter-category'>
                    <p className='filter-category-name'>Status</p>
                    <select className="status-options">
                        <option value="reading">Reading</option>
                        <option value="completed">Completed</option>
                        <option value="paused">Paused</option>
                        <option value="dropped">Dropped</option>
                        <option value="plan to read">Plan to Read</option>
                        <option value="rereading">Rereading</option>
                    </select>
                </div>
                <div className='filter-category'>
                    <p className='filter-category-name'>Country</p>
                    {/*add a country data list not drop down */}
                    <select className="status-options">
                        <option value="reading">Reading</option>
                        <option value="completed">Completed</option>
                        <option value="paused">Paused</option>
                        <option value="dropped">Dropped</option>
                        <option value="plan to read">Plan to Read</option>
                        <option value="rereading">Rereading</option>
                    </select>
                </div>
                <div className='filter-category-bottom'>
                    <p className='filter-category-name'>Sort</p>
                    {/*title, score, progress, last updated, last, added, start date, completion date, release date, avg score, popularity*/}
                    <select className="status-options">
                    <option value="reading">Reading</option>
                    <option value="completed">Completed</option>
                    <option value="paused">Paused</option>
                    <option value="dropped">Dropped</option>
                    <option value="plan to read">Plan to Read</option>
                    <option value="rereading">Rereading</option>
                    </select>
                </div>
                <div className='filter-category'>
                    <p className='filter-category-name'>Year</p>
                    <input className='user-chronicle-filters-year' placeholder='ex: 2019-2024'></input>
                </div>
            </div>
            <AddChroniclesPage/>
            {chronicleStatus.map((title, index) => (
                <StatusContainer status={title} key={index} chroniclesStatus={categorizedChronicles[index]} chronicles={UserChronicles} listOfChanges={listOfChanges}/>
            ))}
        </div>
    </div>
  );
}
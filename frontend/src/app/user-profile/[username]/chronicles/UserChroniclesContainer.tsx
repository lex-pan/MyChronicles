/*
Future ToDo's for this section
    - implement react window for smooth user exp in the case we are overwhelmed
    - data caching and modification when user decides to change it 
    - implement db actions for chronicles request, delete, update
    - QOL filter actions on chronicles
    - different ways to categorize chronicles 
*/

"use client";
import { useEffect, useRef, useState } from 'react';
import { MouseEvent } from 'react';
import StatusContainer from './StatusContainer';
import { UserChronicle, UserChronicleData } from '@/app/utils/interfaces';
import AddChroniclesPage from './AddChroniclesPage';

export default function UserChroniclesLayout({user_chronicles, viewers_username, username} : UserChronicleData) {
    let listOfChanges : Record<string, any> = useRef({});
    // call function to get user's entries 
    // retrieve data from session storage
    const [chronicleStatus, setChronicleStatus] = useState(["Reading", "Completed", "Rereading", "Plan to Read", "Paused", "Dropped"]);
    const [categorizedChronicles, setCategorizedChronicles] = useState<Array<Array<UserChronicle>>>(() => sortByStatus(user_chronicles));
    const [deleteChronicleName, setDeleteChronicleName] = useState<UserChronicle | null>(null);
    const [toggleConfirmDelete, setToggleConfirmDelete] = useState(false);
    const [toggleAddChronicles, setToggleAddChronicles] = useState(false);

        useEffect(() => {
            window.addEventListener("beforeunload",  () => {
                changesToDb(listOfChanges);
            });

            return () => {
                changesToDb(listOfChanges);
            }
        }, []);

    async function changesToDb(changes : Record<string, any>) {
        if (Object.keys(changes.current).length == 0) {
            return 
        }

        let jsonified = JSON.stringify(changes.current);
        const response = await fetch(`http://localhost:5172/user/${username}/chronicles/update`, {
            method: 'POST',
            credentials: 'include', // Include cookies with the request
            headers : { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "listOfChanges": changes.current
            })
        });

        console.log("api was called");
    }

    function sortByStatus(filteredChronicles: Array<UserChronicle>) {
        let newArray : any[] = [];
        let statusMap: {[key: string]: number} = {};
        for (let i = 0; i < chronicleStatus.length; i++) {
            newArray.push([]);
            statusMap[chronicleStatus[i]] = i;
        }

        for (let i = 0; i < filteredChronicles.length; i++) {
            let chronicle = filteredChronicles[i];
            if (listOfChanges.current[chronicle.book_id] !== undefined) {
                for (const key in listOfChanges.current[chronicle.book_id]) {
                    if (Object.prototype.hasOwnProperty.call(chronicle, key)) {
                        (chronicle as any)[key] = listOfChanges.current[chronicle.book_id][key];
                    }
                }
            }
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
        let desiredMedium : Array<UserChronicle> = new Array<UserChronicle>();

        for (let i=0; i < user_chronicles.length; i++) {
            if (user_chronicles[i].entertainment_category == entertainment_category) {
                desiredMedium.push(user_chronicles[i]);
            }
        }

        return desiredMedium;
    }

    function filterChroniclesByMedium(mediumType: string) {
        switch(mediumType){
            case 'Novels':
                const novelsOnly : Array<UserChronicle> = filterUserChronicles("Novel");
                return novelsOnly;
            case 'Graphic Novels':
                const graphicNovelsOnly : Array<UserChronicle> = filterUserChronicles("Graphic Novel");
                return graphicNovelsOnly;
            case 'Films':
                const filmsOnly : Array<UserChronicle> = filterUserChronicles("Film");
                return filmsOnly;
            case 'Shows':
                const showsOnly : Array<UserChronicle> = filterUserChronicles("Show");
                return showsOnly;
            default: 
                return user_chronicles;
        }
    }

    function mediumChange(e: MouseEvent<HTMLDivElement, Event>, index: number, medium: string) {
        cssFolderEffect(e, index);
        let filteredChronicles = filterChroniclesByMedium(medium);
        let sortedChronicles = sortByStatus(filteredChronicles);
        setCategorizedChronicles(sortedChronicles);
    }

    function searchChronicleTitles(e : React.ChangeEvent<HTMLInputElement>) {
        let searchResults : Array<UserChronicle> = new Array<UserChronicle>;

        console.log(e.target.value);
        let searchText = e.target.value;
        
        for (let i = 0; i < user_chronicles.length; i++) {
            if (user_chronicles[i].book_name.toLowerCase().includes(searchText.toLowerCase())) {
                searchResults.push(user_chronicles[i]);
            }
        }

        let sortedChronicles = sortByStatus(searchResults);
        setCategorizedChronicles(sortedChronicles);
    }

    function toggleSearch() {
        setToggleAddChronicles(value => !value);
    }

    function toggleDelete(userChronicleForDelete : UserChronicle | null) {
        if (userChronicleForDelete) {
            setDeleteChronicleName(value => userChronicleForDelete);
        }
        setToggleConfirmDelete(value => !value);
    }

    function deleteChronicle() {
        let index = 0;
        
        for (let i = 0; i < chronicleStatus.length; i++) {
            // will need a way to dynamically switch based on how it's categorized
            // we retrieve the index of the categorized array that we want to remove from
            if (chronicleStatus[i] == deleteChronicleName?.entertainment_category) {
                index = i;
            }
        }   

        const filtered = categorizedChronicles[index].filter(chronicle => chronicle.book_id !== deleteChronicleName?.book_id);
        const updatedCategorizedChronicles = categorizedChronicles.map((categoryChronicles, i) => {
            if (i === index) {
                return filtered;
            }
            return categoryChronicles;
        });

        setCategorizedChronicles(updatedCategorizedChronicles);
        toggleDelete(null);

        // send call to db notifying it that user has deleted item 
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
                <button className='user-chronicle-filters-button' onClick={toggleSearch}>Add Chronicle</button>
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
            {toggleConfirmDelete &&
            <div className='overlay'>
                <div className='confirm-delete'>
                    <h1>Delete {deleteChronicleName?.book_name}?</h1>
                    <div className='confirm-delete-button-container'>
                        <button onClick={() => toggleDelete(null)} className='no'>No</button>
                        <button onClick={deleteChronicle} className='yes'>Yes</button>
                    </div>
                </div>
            </div>
            }
            {toggleAddChronicles && <AddChroniclesPage toggle={toggleSearch}/>} 
            {chronicleStatus.map((title, index) => (
                <StatusContainer status={title} key={index} chroniclesStatus={categorizedChronicles[index]} 
                                 listOfChanges={listOfChanges} confirmDelete={toggleDelete} username={username}/>
            ))}
        </div>
    </div>
  );
}
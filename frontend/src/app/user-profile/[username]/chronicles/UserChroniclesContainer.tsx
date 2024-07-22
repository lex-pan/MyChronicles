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
import { useAppSelector, useAppDispatch, useAppStore } from '../../../../globalRedux/hooks';
import { clearChanges } from '@/globalRedux/features/User/UserChroniclesSlice';

export default function UserChroniclesLayout({ssProfileUC, profileUsername, profileExists} : UserChronicleData) {
    let viewerUCredux = useAppStore();
    const dispatch = useAppDispatch();
    const [chronicleStatus, setChronicleStatus] = useState(["Reading", "Completed", "Rereading", "Plan to Read", "Paused", "Dropped", "-"]);
    let viewerUsername = useAppSelector((state) => state.UserChronicles.username); 
    const [editAllowed, setEditAllowed] = useState(false);
    const [categorizedChronicles, setCategorizedChronicles] = useState<Array<Record<string, UserChronicle>>>();
    let profileUC = useRef<Record<string, UserChronicle>>();
    profileViewSetup();

    // page interactivity
    const [deleteChronicleName, setDeleteChronicleName] = useState<UserChronicle | null>(null);
    const [toggleConfirmDelete, setToggleConfirmDelete] = useState(false);
    const [toggleAddChronicles, setToggleAddChronicles] = useState(false);

    useEffect(() => {
        window.addEventListener("beforeunload",  () => {
            changesToDb();
        });

        return () => {
            changesToDb();
        }
    }, []);

    async function changesToDb() {
        let listOfChangesToDb = viewerUCredux.getState().UserChronicles.listOfChanges;

        if (listOfChangesToDb == undefined || Object.keys(listOfChangesToDb).length == 0 || viewerUsername == "") {
            return 
        }
        console.log(listOfChangesToDb);
        const response = await fetch(`http://localhost:5172/user/${viewerUsername}/chronicles/update`, {
            method: 'POST',
            credentials: 'include', // Include cookies with the request
            headers : { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "listOfChanges": listOfChangesToDb
            })
        });
        
        dispatch(clearChanges());
    }

    function profileViewSetup() {
        if ((viewerUsername == profileUsername && profileUC.current != undefined && "!!!UninitializedReduxStore!!!" in profileUC.current)) {
            setEditAllowed(true);
            profileUC.current = structuredClone(viewerUCredux.getState().UserChronicles.userChronicles);
            setCategorizedChronicles(sortByStatus(profileUC.current ? profileUC.current : {}));
        } 

        if (profileUC.current == undefined) {
            setEditAllowed(false);
            if (ssProfileUC == undefined) {
                profileUC.current = {"!!!UninitializedReduxStore!!!": {book_id: "", book_name: "", entertainment_category: "", episode: -1, last_read: "", rating: 0, userChronicleForDelete: null, status:""}};
                setCategorizedChronicles([]);
            } else {
                profileUC.current = ssProfileUC;
                setCategorizedChronicles(sortByStatus(profileUC.current));
            }

        }
    }
    
    function sortByStatus(filteredChronicles: Record<string, UserChronicle>) {
        let newArray : any[] = [];
        let statusMap: {[key: string]: number} = {};
        for (let i = 0; i < chronicleStatus.length; i++) {
            newArray.push([]);
            statusMap[chronicleStatus[i]] = i;
        }
        console.log(filteredChronicles);
        if (filteredChronicles != undefined && Object.keys(filteredChronicles).length > 0) {
            Object.values(filteredChronicles).forEach(chronicle => {                
                const status = chronicle.status;
                const index = statusMap[status];
                newArray[index].push(chronicle);
            });
        }        
        console.log(newArray);
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
        let desiredMedium : Record<string, UserChronicle> = {};

        if (profileUC.current == undefined) {
            return {}
        }

        for (const key in profileUC.current) {
            if (profileUC.current[key].entertainment_category == entertainment_category) {
                desiredMedium[key] = profileUC.current[key];
            }
        }

        return desiredMedium;
    }

    function filterChroniclesByMedium(mediumType: string) {
        switch(mediumType){
            case 'Novels':
                const novelsOnly : Record<string, UserChronicle> = filterUserChronicles("Novel");
                return novelsOnly;
            case 'Graphic Novels':
                const graphicNovelsOnly : Record<string, UserChronicle> = filterUserChronicles("Graphic Novel");
                return graphicNovelsOnly;
            case 'Films':
                const filmsOnly : Record<string, UserChronicle> = filterUserChronicles("Film");
                return filmsOnly;
            case 'Shows':
                const showsOnly : Record<string, UserChronicle> = filterUserChronicles("Show");
                return showsOnly;
            default: 
                return profileUC.current;
        }
    }

    function mediumChange(e: MouseEvent<HTMLDivElement, Event>, index: number, medium: string) {
        cssFolderEffect(e, index);
        let filteredChronicles = filterChroniclesByMedium(medium);
        if (filteredChronicles !=  undefined) {
            let sortedChronicles = sortByStatus(filteredChronicles);
            setCategorizedChronicles(sortedChronicles);
        }
    }

    // current algo time complexity for searching items is shit
    // create generalized suffix tree using Ukkonens algo O(n*m) where n is the number of chronicles and m is the avg length
    // can return results for each query in O(n) where n is length of query string
    // can consider implementing my own client side typescript version, or using api call for trienet https://github.com/gmamaladze/trienet
    // maybe implement if performance is really bad  
    
    function searchChronicleTitles(e : React.ChangeEvent<HTMLInputElement>) {
        let searchResults : Record<string, UserChronicle> = {};
        let searchText = e.target.value;
        
        for (const key in profileUC.current) {
            if (profileUC.current.hasOwnProperty(key)) {
                const chronicle : UserChronicle = profileUC.current[key];
                if (chronicle.book_name.toLowerCase().includes(searchText.toLowerCase())) {
                    searchResults[chronicle.book_id] = chronicle;            
                } 
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
        if (categorizedChronicles == undefined) {
            return
        }

        let index = 0;
        
        for (let i = 0; i < chronicleStatus.length; i++) {
            // will need a way to dynamically switch based on how it's categorized
            // we retrieve the index of the categorized array that we want to remove from
            if (chronicleStatus[i] == deleteChronicleName?.entertainment_category) {
                index = i;
            }
        }   

        const UCbyStatus : Record<string, UserChronicle> = categorizedChronicles[index]; 
        let UCafterRemoval : Record<string, UserChronicle> = {};

        for (const key in UCbyStatus) {
            if (UCbyStatus.hasOwnProperty(key)) {
                if (UCbyStatus[key].book_id !== deleteChronicleName?.book_id) {
                    UCafterRemoval[key] = UCbyStatus[key];
                }
            }
        }

        const updatedCategorizedChronicles = categorizedChronicles.map((categoryChronicles, i) => {
            if (i === index) {
                return UCafterRemoval;
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
    <>
    {profileExists && 
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
            {categorizedChronicles && chronicleStatus.map((title, index) => (
                <StatusContainer status={title} key={index} chroniclesStatus={categorizedChronicles[index]} confirmDelete={toggleDelete} profileUsername={profileUsername} profileUC={profileUC.current}/>
            ))}
        </div>
    </div>
    }
    {!profileExists &&
        <div>404: Profile does not exist</div>
    }
    </>
  );
}
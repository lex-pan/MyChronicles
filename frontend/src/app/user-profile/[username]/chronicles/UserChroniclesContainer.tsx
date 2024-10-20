/*
Future ToDo's for this section
    - implement react window for smooth user exp in the case we are overwhelmed
    - data caching and modification when user decides to change it 
    - implement db actions for chronicles request, delete, update
    - QOL filter actions on chronicles
    - different ways to categorize chronicles 
*/

"use client";
import { useEffect, useRef, useState, MouseEvent, CSSProperties, LegacyRef } from 'react';
import { UserChronicle, UserChronicleData } from '@/app/utils/interfaces';
import AddChroniclesPage from './AddChroniclesPage';
import { useAppSelector, useAppDispatch, useAppStore } from '../../../../globalRedux/hooks';
import { clearChanges, updateSort } from '@/globalRedux/features/User/UserChroniclesSlice';
import apiLink from '@/app/utils/apiLink';
import UserChronicleComponent from "./UserChronicle"
import ImportChronicles from './ImportChronicles';
import { WindowScroller, List } from "react-virtualized";
import DeleteChronicle from './DeleteChronicle';
import MediumChange from './MediumChange';

export default function UserChroniclesLayout({ssProfileUC, profileUsername, profileExists} : UserChronicleData) {
    let viewerUCredux = useAppStore();
    const dispatch = useAppDispatch();
    const sortCategories : Record<string, Array<string>> = {
        status: ["Reading", "Completed", "Rereading", "Plan to Read", "Paused", "Dropped", "-"],
        rating: ["5", "4", "3", "2", "1", "-"],
        last_read: ["Today", "Yesterday", "This week", "This month", "This year", "A long time ago", "-"]
    };
    const [categorizedChroniclesIndex, setCategorizedChroniclesIndex] = useState<Record<number, number>>({});
    let viewerUsername = useAppSelector((state) => state.UserChronicles.username); 
    const [editAllowed, setEditAllowed] = useState(false);
    const [categorizedChronicles, setCategorizedChronicles] = useState<Array<UserChronicle>>();
    let profileUC = useRef<Record<string, UserChronicle>>();
    const bindListRef = useRef<List | null>(null);
    const [UCdropdownStatus, setUCdropdownStatus] = useState<Array<boolean>>([]);

    profileViewSetup();
    // page interactivity
    const [deleteChronicleName, setDeleteChronicleName] = useState<UserChronicle | null>(null);
    const [toggleConfirmDelete, setToggleConfirmDelete] = useState(false);
    const [toggleAddChronicles, setToggleAddChronicles] = useState(false);
    const [toggleImport, setToggleImport] = useState(false);

    const Row = ({ index, style } : {index : number, style : CSSProperties}) => {
        if (categorizedChronicles == undefined) return;
        const item : UserChronicle | undefined = categorizedChronicles[index]; // Get the item for the current index

        // Ensure the item is defined before trying to access its properties
        if (!item) return null; // Or return a loading state or placeholder

        if (categorizedChroniclesIndex[index] != undefined) {
            let primarySortBy = viewerUCredux.getState().UserChronicles.primarySortBy;

            return (
                <div style={{...style, top: style.top ? (typeof style.top == "string" ? parseInt(style.top) + 15 : style.top + 15) : 15}} key={index} className='category'>
                    <h1 className='user-section-title'>{sortCategories[primarySortBy][categorizedChroniclesIndex[index]]}</h1>
                    <div className="user-section-attributes">
                        <p className='user-container-category'>Title</p>
                        <p className='user-container-category'>Rating</p>
                        <p className='user-container-category'>Episodes</p>
                        <p className='user-container-category'>Status</p>
                        <p className='user-container-category'>Last Read</p>
                    </div>
                    
                    <UserChronicleComponent
                        key={categorizedChronicles[index].book_id}
                        item={categorizedChronicles[index]}
                        confirmDelete={toggleDelete}
                        profileUsername={profileUsername}
                        profileUC={profileUC.current}
                        dropdownStatus={UCdropdownStatus}
                        changeDropdownStatus={changeDropdownStatus}
                        index={index}
                    />
                </div>
            )
        } else {
            return (            
                <div style={style} key={index}>
                    <UserChronicleComponent
                        key={categorizedChronicles[index].book_id}
                        item={categorizedChronicles[index]}
                        confirmDelete={toggleDelete}
                        profileUsername={profileUsername}
                        profileUC={profileUC.current}
                        dropdownStatus={UCdropdownStatus}
                        changeDropdownStatus={changeDropdownStatus}
                        index={index}
                    />
                </div>
            );
        }
    }

    function changeDropdownStatus(index: number) {
        const updatedDropdown = UCdropdownStatus.map((dropdownStatus, dropdownIndex) => dropdownIndex == index ? !dropdownStatus : dropdownStatus);
        setUCdropdownStatus(updatedDropdown);
        if (bindListRef.current) {
            bindListRef.current.recomputeRowHeights();
        }
    }

    // when toggling between mediums (novels, films, shows, etc)
    // row height between title (reading, completed) and row is different compared to row so we need to recalculate row heights 
    useEffect(() => {
        if (bindListRef.current) {
            bindListRef.current.recomputeRowHeights();
        }
    }, [categorizedChronicles])

    useEffect(() => {
        const handleUCvisibilityChange = () => {
            sendUCchanges(false);
        };    

        function sendUCchanges(dismount: boolean) {
            let listOfUserChronicleChangesToDb = viewerUCredux.getState().UserChronicles.listOfChanges;
            let sortChangesToDb = viewerUCredux.getState().UserChronicles.sortByChanges;
            
            if ((document.visibilityState === "hidden" || dismount) && (Object.keys(listOfUserChronicleChangesToDb).length > 0 || Object.keys(sortChangesToDb).length > 0) && viewerUsername != "") {
              var url = `${apiLink}/user/${viewerUsername}/chronicles/update`;
              var data = JSON.stringify({
                "listOfChanges": listOfUserChronicleChangesToDb,
                "sortChanges": sortChangesToDb
              });
              
              console.log("sending changes to db");
              const blob = new Blob([data], { type: 'application/json' });
              dispatch(clearChanges());
              navigator.sendBeacon(url, blob);

            }
            
        }

        document.addEventListener('visibilitychange', handleUCvisibilityChange);

        return() => {            
            sendUCchanges(true);
            document.removeEventListener('visibilitychange', handleUCvisibilityChange);
        }
    }, [dispatch, viewerUCredux, viewerUsername]);

    useEffect(() => {
        if (viewerUsername != profileUsername) {
            setEditAllowed(false);
        } else {
            setEditAllowed(true);
        }
    }, [viewerUsername, profileUsername])

    useEffect(() => {
        const handleKey = (event : KeyboardEvent) => {
            if (event.key === 'PageUp' || event.key === 'PageDown') {
                event.preventDefault(); // Prevent the default scroll behavior
                const scrollAmount = 500; // Amount to scroll in pixels
                const direction = event.key === 'PageUp' ? -1 : 1; // Determine the scroll direction
    
                // Scroll the page by a specified amount
                window.scrollBy({
                    top: direction * scrollAmount,
                    behavior: 'smooth', // Smooth scrolling
                });
            }
        };
    
        // Add the event listener
        window.addEventListener('keydown', handleKey);
        window.addEventListener('keyup', handleKey);
    
        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('keydown', handleKey);
            window.addEventListener('keyup', handleKey);
        };
    }, []);

    // this is used so that I don't have to wait for page to load (which is what happens in useeffect) before setting up, 
    function profileViewSetup() {
        if ((viewerUsername == profileUsername && profileUC.current != undefined && "!!!UninitializedReduxStore!!!" in profileUC.current)) {
            profileUC.current = structuredClone(viewerUCredux.getState().UserChronicles.userChronicles);
            console.log(profileUC.current);
            setCategorizedChronicles(sortUC(profileUC.current ? profileUC.current : {}));
        } 

        if (profileUC.current == undefined) {
            if (ssProfileUC == undefined) {
                profileUC.current = {"!!!UninitializedReduxStore!!!": {book_id: "", book_name: "", entertainment_category: "", episode: -1, last_read: "", rating: 0, userChronicleForDelete: null, status:""}};
                setCategorizedChronicles([]);
            } else {
                profileUC.current = ssProfileUC;
                setCategorizedChronicles(sortUC(profileUC.current));
            }
        }   
    }
    
    function sortUC(filteredChronicles: Record<string, UserChronicle>) : Array<UserChronicle> {
        // divide into categories (the different sections of status, or last read, or rating) 
        let newArray : Array<Array<UserChronicle>> = [];
        let category : {[key: string]: number} = {};
        let primarySortBy = viewerUCredux.getState().UserChronicles.primarySortBy;

        for (let i = 0; i < sortCategories[primarySortBy].length; i++) {
            newArray.push([]);
            category[sortCategories[primarySortBy][i]] = i;
        }

        if (filteredChronicles != undefined && Object.keys(filteredChronicles).length > 0) {
            Object.values(filteredChronicles).forEach(chronicle => {                
                let index = 0;
                switch (primarySortBy) {
                    case 'status': 
                        const status = chronicle.status;
                        index = category[status];
                        break;
                    case 'rating': 
                        let rating = chronicle.rating;
                        if (rating) {
                            rating = Math.floor(rating);
                            index = category[rating];
                        } else {
                            index = 5;
                        }
                        break;
                    case 'last_read':
                        const last_read = chronicle.last_read;
                        if (last_read) {
                            const last_read_date = last_read.split('T')[0]; // "2024-07-06"
                            // Create Date objects
                            const givenDate = new Date(last_read_date);
                            const currentDate = new Date();

                            // Calculate the difference in time
                            const timeDifference = currentDate.getTime() - givenDate.getTime();
                            // Convert time difference to days
                            const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                            if (daysDifference == 0) {
                                index = 0;
                            } else if (daysDifference == 1) {
                                index = 1;
                            } else if (daysDifference < 8) {
                                index = 2;
                            } else if (daysDifference < 32) {
                                index = 3;
                            } else if (daysDifference < 366) {
                                index = 4
                            } else if (daysDifference != 739177){
                                index = 5;
                            } else {
                                index = 6;
                            }
                        } else {
                            index = 6; 
                        }
                        break;
                }
                if (newArray[index]) { // Ensure the index exists in newArray
                    newArray[index].push(chronicle);
                }
            });
        }        
        
        sortSecondaryArrays(newArray);

        let indexes : Record<number, number> = {0: 0};
        let prevIndex = 0;
        let oneBigArray : Array<UserChronicle> = [];
        for (let i = 0; i < newArray.length; i++) {
            const categoryIndex = prevIndex + newArray[i].length;
            indexes[categoryIndex] = i+1;
            prevIndex = categoryIndex;
            oneBigArray = [...oneBigArray, ...newArray[i]];
        }

        setCategorizedChroniclesIndex(indexes);
        setUCdropdownStatus(Array(oneBigArray.length).fill(false)); // Initialize with all dropdowns closed);

        return oneBigArray;
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

        let sortedChronicles = sortUC(searchResults);
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

    function toggleImportChronicles() {
        setToggleImport(value => !value);
    }   

    function changeSort(e: string, sortType: string) {
        dispatch(updateSort({sortType: sortType, sortValue: e}));

        if (profileUC.current) {
            setCategorizedChronicles(sortUC(profileUC.current));
        }

        bindListRef.current?.recomputeRowHeights();
    }

    function sortSecondaryArrays(arrayToSort: Array<Array<UserChronicle>>) {
        let secondarySortBy = viewerUCredux.getState().UserChronicles.secondarySortBy;
        for (let i = 0; i < arrayToSort.length; i++) {
            switch (secondarySortBy) {
                case "none":
                    return arrayToSort;
                case "rating":
                    arrayToSort[i] = arrayToSort[i].sort((a, b) => {
                        if (a.rating == null) return 1;
                        if (b.rating == null) return -1;
                        return b.rating - a.rating;
                    })
                    break;
                case "episodes":
                    arrayToSort[i] = arrayToSort[i].sort((a, b) => {
                        if (a.episode == null) return 1;
                        if (b.episode == null) return -1;
                        return b.episode - a.episode;
                    })
                    break;
                case "last read":
                    arrayToSort[i] = arrayToSort[i].sort((a, b) => {
                        if (a.last_read == null) return 1;
                        if (b.last_read == null) return -1;
                        let a_last_read = new Date(a.last_read.split('T')[0]);
                        let b_last_read = new Date(b.last_read.split('T')[0]);
                        return b_last_read.getTime() - a_last_read.getTime();
                    })
                    break;
            }
        }
    }

  // when users edit, save changes to session storage
  // when the user closes the browser/reloads the browser update the database 
  return (
    <>
    {profileExists && 
    <div className='chronicles-section'>
        <MediumChange profileUC={profileUC.current} sortUC={sortUC} setCategorizedChronicles={setCategorizedChronicles}/>
        <div className='user-container'>            
            <div className='user-chronicle-filters'>
                <input className='user-chronicle-filters-search' placeholder='search bar' onChange={searchChronicleTitles}></input>
                <div className='filter-category filter-sort-options'>
                    <p className='filter-category-name'>Sort By</p>
                    <select className="status-options" defaultValue={viewerUCredux.getState().UserChronicles.primarySortBy} onChange={(e) => changeSort(e.target.value, "primary")}>
                        <option value="status">Status</option>
                        <option value="rating">Rating</option>
                        <option value="last_read">Last Read</option>
                    </select>
                    {/* title A-Z, last updated, start date, start date, avg score, popularity*/}
                    <select className="status-options" defaultValue={viewerUCredux.getState().UserChronicles.secondarySortBy} onChange={(e) => changeSort(e.target.value, "secondary")}>
                        <option value="none">None</option>
                        <option value="rating">Rating</option>
                        <option value="episodes">Episodes</option>
                        <option value="last read">Last Read</option>
                    </select>
                </div>
                {editAllowed &&
                    <>
                    <div className='filter-category'>
                        <button className='user-chronicle-filters-button' onClick={toggleSearch}>Add Chronicle</button>                
                    </div>
                    <button className='user-chronicle-filters-button' onClick={toggleImportChronicles}>Import</button>                
                    </>        
                }
                {/*Add the other filters back here when implemented*/}
            </div>
            {toggleImport &&
                <ImportChronicles toggleImportChronicles={toggleImportChronicles}/>
            }
            {toggleConfirmDelete &&
                <DeleteChronicle categorizedChronicles={categorizedChronicles} chronicleStatus={sortCategories[viewerUCredux.getState().UserChronicles.primarySortBy]} setCategorizedChronicles={setCategorizedChronicles} toggleDelete={toggleDelete} deleteChronicleName={deleteChronicleName}/>
            }
            {toggleAddChronicles && <AddChroniclesPage toggle={toggleSearch} setCategorizedChronicles={setCategorizedChronicles} sortUC={sortUC} profileUC={profileUC.current}/>} 
            <div className='user-container-section'>
                <WindowScroller>
                    {({ height, isScrolling, onChildScroll, scrollTop, registerChild }) => (
                    <div ref={registerChild as LegacyRef<HTMLDivElement>}>
                        <List 
                            autoHeight
                            height={height}
                            isScrolling={isScrolling}
                            onScroll={onChildScroll}
                            rowCount={categorizedChronicles?.length ? categorizedChronicles.length + 1 : 1}
                            rowHeight={({ index }) =>
                                (categorizedChroniclesIndex[index] !== undefined ? 175 : 46) + (UCdropdownStatus[index] ? 433 : 0)
                            }
                            ref={bindListRef}
                            rowRenderer={Row}
                            scrollTop={scrollTop}
                            width={1033}
                        />
                    </div>

                    )}
                </WindowScroller>
            </div>

        </div>
    </div>
    }
    {!profileExists &&
        <div>404: Profile does not exist</div>
    }
    </>
  );
}

/*
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
    // title, score, progress, last updated, last, added, start date, completion date, release date, avg score, popularity
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
*/
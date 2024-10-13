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
import { clearChanges, deleteUC } from '@/globalRedux/features/User/UserChroniclesSlice';
import apiLink from '@/app/utils/apiLink';
import UserChronicleComponent from "./UserChronicle"
import ImportChronicles from './ImportChronicles';
import { WindowScroller, List } from "react-virtualized";
import DeleteChronicle from './DeleteChronicle';
import MediumChange from './MediumChange';

export default function UserChroniclesLayout({ssProfileUC, profileUsername, profileExists} : UserChronicleData) {
    let viewerUCredux = useAppStore();
    const dispatch = useAppDispatch();
    const [chronicleStatus, setChronicleStatus] = useState(["Reading", "Completed", "Rereading", "Plan to Read", "Paused", "Dropped", "-"]);
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
            return (
                <div style={{...style, top: style.top ? (typeof style.top == "string" ? parseInt(style.top) + 25 : style.top + 25) : 25}} key={index} className='category'>
                    <h1 className='user-section-title'>{chronicleStatus[categorizedChroniclesIndex[index]]}</h1>
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
            
            if ((document.visibilityState === "hidden" || dismount) && Object.keys(listOfUserChronicleChangesToDb).length > 0 && viewerUsername != "") {
              var url = `${apiLink}/user/${viewerUsername}/chronicles/update`;
              var data = JSON.stringify({
                "listOfChanges": listOfUserChronicleChangesToDb
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
            setCategorizedChronicles(sortByStatus(profileUC.current ? profileUC.current : {}));
        } 

        if (profileUC.current == undefined) {
            if (ssProfileUC == undefined) {
                profileUC.current = {"!!!UninitializedReduxStore!!!": {book_id: "", book_name: "", entertainment_category: "", episode: -1, last_read: "", rating: 0, userChronicleForDelete: null, status:""}};
                setCategorizedChronicles([]);
            } else {
                profileUC.current = ssProfileUC;
                setCategorizedChronicles(sortByStatus(profileUC.current));
            }
        }   
    }
    
    function sortByStatus(filteredChronicles: Record<string, UserChronicle>) : Array<UserChronicle> {
        // allows us to divide into categories 
        let newArray : Array<Array<UserChronicle>> = [];
        let statusMap: {[key: string]: number} = {};
        for (let i = 0; i < chronicleStatus.length; i++) {
            newArray.push([]);
            statusMap[chronicleStatus[i]] = i;
        }

        if (filteredChronicles != undefined && Object.keys(filteredChronicles).length > 0) {
            Object.values(filteredChronicles).forEach(chronicle => {                
                const status = chronicle.status;
                const index = statusMap[status];
                if (newArray[index]) { // Ensure the index exists in newArray
                    newArray[index].push(chronicle);
                }
            });
        }        
        
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

    function toggleImportChronicles() {
        setToggleImport(value => !value);
    }   

  // when users edit, save changes to session storage
  // when the user closes the browser/reloads the browser update the database 
  return (
    <>
    {profileExists && 
    <div className='chronicles-section'>
        <MediumChange profileUC={profileUC.current} sortByStatus={sortByStatus} setCategorizedChronicles={setCategorizedChronicles}/>
        <div className='user-container'>            
            <div className='user-chronicle-filters'>
                <input className='user-chronicle-filters-search' placeholder='search bar' onChange={searchChronicleTitles}></input>
                {editAllowed &&
                    <>
                    <button className='user-chronicle-filters-button' onClick={toggleSearch}>Add Chronicle</button>                
                    <button className='user-chronicle-filters-button' onClick={toggleImportChronicles}>Import</button>                
                    </>        
                }
                {/*Add the other filters back here when implemented*/}
            </div>
            {toggleImport &&
                <ImportChronicles toggleImportChronicles={toggleImportChronicles}/>
            }
            {toggleConfirmDelete &&
                <DeleteChronicle categorizedChronicles={categorizedChronicles} chronicleStatus={chronicleStatus} setCategorizedChronicles={setCategorizedChronicles} toggleDelete={toggleDelete} deleteChronicleName={deleteChronicleName}/>
            }
            {toggleAddChronicles && <AddChroniclesPage toggle={toggleSearch} setCategorizedChronicles={setCategorizedChronicles} sortByStatus={sortByStatus} profileUC={profileUC.current}/>} 
            <div className='user-container-section'>
                <WindowScroller>
                    {({ height, isScrolling, onChildScroll, scrollTop, registerChild }) => (
                    <div ref={registerChild as LegacyRef<HTMLDivElement>}>
                        <List 
                            autoHeight
                            height={height}
                            isScrolling={isScrolling}
                            onScroll={onChildScroll}
                            rowCount={categorizedChronicles?.length ?? 0}
                            rowHeight={({ index }) =>
                                (categorizedChroniclesIndex[index] !== undefined ? 153 : 46) + (UCdropdownStatus[index] ? 433 : 0)
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
/*
Future ToDo's for this section
    - implement react window for smooth user exp in the case we are overwhelmed
    - data caching and modification when user decides to change it 
    - implement db actions for chronicles request, delete, update
    - QOL filter actions on chronicles
    - different ways to categorize chronicles 
*/

"use client";
import { useEffect, useRef, useState, MouseEvent, CSSProperties, forwardRef } from 'react';
import { UserChronicle, UserChronicleData } from '@/app/utils/interfaces';
import AddChroniclesPage from './AddChroniclesPage';
import { useAppSelector, useAppDispatch, useAppStore } from '../../../../globalRedux/hooks';
import { clearChanges, deleteUC } from '@/globalRedux/features/User/UserChroniclesSlice';
import apiLink from '@/app/utils/apiLink';
import UserChronicleComponent from "./UserChronicle"
import ImportChronicles from './ImportChronicles';
import { FixedSizeList as List } from 'react-window';

const outerElementType = forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
    (props, ref) => {
      // Move useRef outside the return statement
      const scrollableRef = useRef<HTMLDivElement | null>(null);

      useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'PageDown') {
                event.preventDefault(); // Prevent the default page scroll
                if (window.scrollY < 152) {
                    window.scrollTo({
                        top: 152,
                        behavior: 'smooth'
                    });
                } else {
                    if (scrollableRef.current) {
                        if (scrollableRef.current.scrollHeight - scrollableRef.current.scrollTop < 750) {
                            window.scrollTo({
                                top: 900,
                                behavior: 'smooth'
                            })   
                        } else {
                            scrollableRef.current.scrollBy({
                                top: 600, // Adjust this value to control the scroll amount
                                behavior: 'smooth', // Optional: for smooth scrolling
                            });
                        }
                    }
                }
            }

            if (event.key === 'PageUp') {
                event.preventDefault(); // Prevent the default page scroll
                if (window.scrollY > 400) {
                    window.scrollTo({
                        top: 152,
                        behavior: 'smooth'
                    });
                } else {
                    if (scrollableRef.current) {
                        if (scrollableRef.current.scrollTop < 100) {
                            window.scrollTo({
                                top: 0,
                                behavior: 'smooth'
                            })   
                        } else {
                            scrollableRef.current.scrollBy({
                                top: -600, // Adjust this value to control the scroll amount
                                behavior: 'smooth', // Optional: for smooth scrolling
                            });
                        }
                    }
                }
            }
        };

        // Attach the event listener
        window.addEventListener('keydown', handleKeyDown);

        // Clean up the event listener on unmount
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
        
      return (
        <div ref={scrollableRef} {...props} className='UC-react-window' />
      );
    }
);

outerElementType.displayName = 'OuterElementType';
 
export default function UserChroniclesLayout({ssProfileUC, profileUsername, profileExists} : UserChronicleData) {
    let viewerUCredux = useAppStore();
    const dispatch = useAppDispatch();
    const [chronicleStatus, setChronicleStatus] = useState(["Reading", "Completed", "Rereading", "Plan to Read", "Paused", "Dropped", "-"]);
    const categorizedChroniclesIndex = useRef<Record<number, number>>({});
    let viewerUsername = useAppSelector((state) => state.UserChronicles.username); 
    const [editAllowed, setEditAllowed] = useState(false);
    const [categorizedChronicles, setCategorizedChronicles] = useState<Array<UserChronicle>>();
    let profileUC = useRef<Record<string, UserChronicle>>();
    const scrollableRef = useRef<HTMLDivElement | null>(null);
    const [UCindex, setUCindex] = useState(0);
    const [scrollIndex, setScrollIndex] = useState(0);
    // {categorizedChronicles ? categorizedChronicles[UCindex].status : "Reading"}
    profileViewSetup();
    console.log("rerendered");
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
        return (
            <div style={style}>
                <UserChronicleComponent
                    key={categorizedChronicles[index].book_id}
                    item={categorizedChronicles[index]}
                    confirmDelete={toggleDelete}
                    profileUsername={profileUsername}
                    profileUC={profileUC.current}
                />
            </div>
        );
    }

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
        
        categorizedChroniclesIndex.current = {0: 0};
        let prevIndex = 0;
        let oneBigArray : Array<UserChronicle> = [];
        for (let i = 0; i < newArray.length; i++) {
            const categoryIndex = prevIndex + newArray[i].length;
            categorizedChroniclesIndex.current[categoryIndex] = i+1;
            prevIndex = categoryIndex;
            oneBigArray = [...oneBigArray, ...newArray[i]];
        }

        return oneBigArray;
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

    async function deleteChronicle() {
        if (categorizedChronicles == undefined) {
            return
        }

        let index = 0;
        
        for (let i = 0; i < chronicleStatus.length; i++) {
            // will need a way to dynamically switch based on how it's categorized
            // we retrieve the index of the categorized array that we want to remove from
            if (chronicleStatus[i] == deleteChronicleName?.status) {
                index = i;
            }
        }   
        console.log(index);
        console.log(deleteChronicleName);
        const updatedCategorizedChronicles = categorizedChronicles.map((categoryChronicles, i) => {
            if (i === index) {
                console.log(deleteChronicleName?.book_id);
                console.log(deleteChronicleName?.book_id != null);
                if (deleteChronicleName?.book_id != null) {
                    console.log(categoryChronicles);
                    delete categoryChronicles[deleteChronicleName.book_id]
                }

                return categoryChronicles;
            }
            return categoryChronicles;
        });

        setCategorizedChronicles(updatedCategorizedChronicles);
        toggleDelete(null);

        dispatch(deleteUC(deleteChronicleName?.book_id));
        // send to db for delete
        await fetch(`${apiLink}/user/chronicles/delete/${deleteChronicleName?.book_id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/text' // Example: Accept JSON responses
            },
            credentials: 'include'
        });
         
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
            <div className='overlay'>
                <div className='overlay-container delete-chronicle'>
                    <h1 className='overlay-container-title'>Delete {deleteChronicleName?.book_name}?</h1>
                    <div className='overlay-container-button-container'>
                        <button onClick={() => toggleDelete(null)} className='no overlay-container-button'>No</button>
                        <button onClick={deleteChronicle} className='yes overlay-container-button'>Yes</button>
                    </div>
                </div>
            </div>
            }
            {toggleAddChronicles && <AddChroniclesPage toggle={toggleSearch} setCategorizedChronicles={setCategorizedChronicles} sortByStatus={sortByStatus} profileUC={profileUC.current}/>} 
            <div className='user-container-section'>
                <div className="user-section-attributes">
                    <p className='user-container-category'>Title</p>
                    <p className='user-container-category'>Rating</p>
                    <p className='user-container-category'>Episodes</p>
                    <p className='user-container-category'>Status</p>
                    <p className='user-container-category'>Last Read</p>
                </div>
                <List 
                    useIsScrolling 
                    height={692} // height of the list container
                    itemCount={categorizedChronicles?.length ?? 0} // number of items in the list
                    itemSize={46} // height of each row (adjust as needed)
                    width={"100%"} // width of the list container
                    outerElementType={outerElementType}
                    onItemsRendered={({ visibleStartIndex, visibleStopIndex }) => {
                    }}
                >
                    {Row}
                </List>
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
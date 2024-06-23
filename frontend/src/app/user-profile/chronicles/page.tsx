/*
Future ToDo's for this section
    - implement react window for smooth user exp in the case we are overwhelmed
    - data caching and modification when user decides to change it 
    - implement db actions for chronicles request, delete, update
    - QOL filter actions on chronicles
    - different ways to categorize chronicles 
*/

"use client";
import { InputHTMLAttributes, useEffect, useState } from 'react';
import { MouseEvent } from 'react';
import StatusContainer from './StatusContainer';
import AddChronicle from './AddChroniclesPage';
import { UserChronicleData } from '@/app/utils/interfaces';
import AddChroniclesPage from './AddChroniclesPage';
export default function ChronicleCategoryLayout() {

    // retrieve entries from db 
    let UserChronicles : Record<number, UserChronicleData> = {
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
        }, 
        501: {
            userChronicleId: 501,
            bookId: 1,
            title: "Journey to the West - Rediscovering the Myth",
            rating: 5,
            start_date: "2022-01-10",
            last_read: "2023-02-10",
            episode: 30,
            img_src: "https://example.com/journey.jpg",
            review: "An epic journey through history and mythology.",
            notes: "Engaging and deeply insightful.",
            category: "Novel",
            status: "Completed"
        },
        
        502: {
            userChronicleId: 502,
            bookId: 2,
            title: "The Matrix - Unplugged",
            rating: 4,
            start_date: "2022-02-05",
            last_read: "2023-01-25",
            episode: 10,
            img_src: "https://example.com/matrix.jpg",
            review: "A deep dive into the philosophy of the Matrix universe.",
            notes: "Complex but rewarding.",
            category: "Film",
            status: "Completed"
        },
        
        503: {
            userChronicleId: 503,
            bookId: 3,
            title: "Avatar - The Last Airbender: The Legend Continues",
            rating: 5,
            start_date: "2022-03-15",
            last_read: "2023-05-20",
            episode: 12,
            img_src: "https://example.com/avatar.jpg",
            review: "A compelling continuation of the beloved series.",
            notes: "Captivating characters and story.",
            category: "Show",
            status: "Reading"
        },
        
        504: {
            userChronicleId: 504,
            bookId: 5,
            title: "The Odyssey - Modern Interpretations",
            rating: 4,
            start_date: "2022-04-22",
            last_read: "2023-01-30",
            episode: 8,
            img_src: "https://example.com/odyssey.jpg",
            review: "A modern twist on an ancient classic.",
            notes: "Thought-provoking and well-written.",
            category: "Novel",
            status: "Completed"
        },
        
        505: {
            userChronicleId: 505,
            bookId: 6,
            title: "The Witcher - The Saga Continues",
            rating: 4,
            start_date: "2022-05-01",
            last_read: "2023-04-05",
            episode: 6,
            img_src: "https://example.com/witcher.jpg",
            review: "Rich in lore and adventure.",
            notes: "Fantastically written.",
            category: "Novel",
            status: "Reading"
        },
        
        507: {
            userChronicleId: 507,
            bookId: 7,
            title: "The Sandman - Dream's Awakening",
            rating: 5,
            start_date: "2022-06-15",
            last_read: "2023-04-01",
            episode: 20,
            img_src: "https://example.com/sandman.jpg",
            review: "A mesmerizing journey into the world of dreams.",
            notes: "Neil Gaiman at his best.",
            category: "Graphic Novel",
            status: "Completed"
        },
        
        508: {
            userChronicleId: 508,
            bookId: 8,
            title: "Breaking Bad - The Complete Experience",
            rating: 5,
            start_date: "2022-07-10",
            last_read: "2023-03-20",
            episode: 50,
            img_src: "https://example.com/breakingbad.jpg",
            review: "Intense and unforgettable.",
            notes: "Masterpiece of modern television.",
            category: "Show",
            status: "Completed"
        },
        
        509: {
            userChronicleId: 509,
            bookId: 9,
            title: "Star Wars - A New Vision",
            rating: 4,
            start_date: "2022-08-01",
            last_read: "2023-05-30",
            episode: 9,
            img_src: "https://example.com/starwars.jpg",
            review: "A fresh take on the iconic saga.",
            notes: "Impressive visuals and storytelling.",
            category: "Film",
            status: "Reading"
        },
        
        510: {
            userChronicleId: 510,
            bookId: 10,
            title: "Harry Potter - The Untold Stories",
            rating: 5,
            start_date: "2022-09-22",
            last_read: "2023-04-18",
            episode: 40,
            img_src: "https://example.com/harrypotter.jpg",
            review: "Magical and enchanting.",
            notes: "New perspectives on the wizarding world.",
            category: "Novel",
            status: "Completed"
        },
        
        511: {
            userChronicleId: 511,
            bookId: 11,
            title: "Game of Thrones - The Winter Chronicles",
            rating: 4,
            start_date: "2022-10-15",
            last_read: "2023-02-28",
            episode: 60,
            img_src: "https://example.com/gameofthrones.jpg",
            review: "Intriguing and complex.",
            notes: "Detailed and engaging.",
            category: "Show",
            status: "Reading"
        },
        
        512: {
            userChronicleId: 512,
            bookId: 12,
            title: "Inception - The Dream Within",
            rating: 4,
            start_date: "2022-11-10",
            last_read: "2023-03-11",
            episode: 2,
            img_src: "https://example.com/inception.jpg",
            review: "A mind-bending journey into dreams.",
            notes: "Intricately crafted plot.",
            category: "Film",
            status: "Plan To Read"
        },
        
        513: {
            userChronicleId: 513,
            bookId: 13,
            title: "Sherlock Holmes - The New Adventures",
            rating: 5,
            start_date: "2022-12-01",
            last_read: "2023-04-22",
            episode: 15,
            img_src: "https://example.com/sherlock.jpg",
            review: "Mystery and intrigue at its finest.",
            notes: "Brilliant storytelling and character work.",
            category: "Show",
            status: "Rereading"
        },
        
        514: {
            userChronicleId: 514,
            bookId: 14,
            title: "The Expanse - Beyond the Stars",
            rating: 5,
            start_date: "2023-01-10",
            last_read: "2023-06-01",
            episode: 22,
            img_src: "https://example.com/expanse.jpg",
            review: "Epic and expansive space saga.",
            notes: "Gripping and well-executed.",
            category: "Show",
            status: "Dropped"
        },
        
        515: {
            userChronicleId: 515,
            bookId: 15,
            title: "Dune - The Spice Must Flow",
            rating: 4,
            start_date: "2023-02-14",
            last_read: "2023-05-15",
            episode: 12,
            img_src: "https://example.com/dune.jpg",
            review: "A detailed exploration of the Dune universe.",
            notes: "Rich and immersive.",
            category: "Film",
            status: "Paused"
        },
        
        516: {
            userChronicleId: 516,
            bookId: 16,
            title: "Naruto - The Hidden Leaf Chronicles",
            rating: 5,
            start_date: "2023-03-10",
            last_read: "2023-06-12",
            episode: 220,
            img_src: "https://example.com/naruto.jpg",
            review: "An inspiring journey of a ninja.",
            notes: "Emotional and action-packed.",
            category: "Show",
            status: "Plan To Read"
        },
        
        517: {
            userChronicleId: 517,
            bookId: 17,
            title: "The Great Gatsby - Reimagined",
            rating: 4,
            start_date: "2023-04-22",
            last_read: "2023-05-25",
            episode: 4,
            img_src: "https://example.com/gatsby.jpg",
            review: "A fresh take on a classic tale.",
            notes: "Captivating narrative and characters.",
            category: "Novel",
            status: "Rereading"
        },
        
        518: {
            userChronicleId: 518,
            bookId: 18,
            title: "Rick and Morty - The Multiverse Misadventures",
            rating: 5,
            start_date: "2023-05-10",
            last_read: "2023-06-15",
            episode: 30,
            img_src: "https://example.com/rickmorty.jpg",
            review: "Hilarious and thought-provoking.",
            notes: "Inventive and unique.",
            category: "Show",
            status: "Rereading"
        }
    }

    let listOfChanges : Record<number, any> = {};
    // call function to get user's entries 
    // retrieve data from session storage
    const [chronicleStatus, setChronicleStatus] = useState(["Reading", "Completed", "Rereading", "Plan To Read", "Paused", "Dropped"]);
    const [categorizedChronicles, setCategorizedChronicles] = useState<Array<Array<UserChronicleData>>>(sortByStatus(UserChronicles));
    const [deleteChronicleName, setDeleteChronicleName] = useState<[string, number]>(["", 0]);
    const [toggleConfirmDelete, setToggleConfirmDelete] = useState(false);
    const [toggleAddChronicles, setToggleAddChronicles] = useState(false);

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
    
    function sortByStatus(filteredChronicles: Record<number, UserChronicleData>) {
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
        let desiredMedium : Record<number, UserChronicleData> = {};

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
                const novelsOnly : Record<number, UserChronicleData> = filterUserChronicles("Novel");
                return novelsOnly;
            case 'Graphic Novels':
                const graphicNovelsOnly : Record<number, UserChronicleData> = filterUserChronicles("Graphic Novel");
                return graphicNovelsOnly;
            case 'Films':
                const filmsOnly : Record<number, UserChronicleData> = filterUserChronicles("Film");
                return filmsOnly;
            case 'Shows':
                const showsOnly : Record<number, UserChronicleData> = filterUserChronicles("Show");
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
        let searchResults : Record<number, UserChronicleData> = {};

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

    function toggleSearch() {
        setToggleAddChronicles(value => !value);
    }

    function toggleDelete(userChronicleId : number) {
        if (!isNaN(userChronicleId)) {
            setDeleteChronicleName(value => [UserChronicles[userChronicleId].title, userChronicleId]);
        }
        setToggleConfirmDelete(value => !value);
    }

    function deleteChronicle() {
        let index = 0;

        for (let i = 0; i < chronicleStatus.length; i++) {
            // will need a way to dynamically switch based on how it's categorized
            console.log(UserChronicles[deleteChronicleName[1]].category);
            if (chronicleStatus[i] == UserChronicles[deleteChronicleName[1]].status) {
                index = i;
            }
        }   

        const filtered = categorizedChronicles[index].filter(chronicle => chronicle.userChronicleId !== deleteChronicleName[1]);
        const updatedCategorizedChronicles = categorizedChronicles.map((categoryChronicles, i) => {
            if (i === index) {
                return filtered;
            }
            return categoryChronicles;
        });
        setCategorizedChronicles(updatedCategorizedChronicles);
        toggleDelete(NaN);

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
                    <h1>Delete {deleteChronicleName[0]}?</h1>
                    <div className='confirm-delete-button-container'>
                        <button onClick={() => toggleDelete(NaN)} className='no'>No</button>
                        <button onClick={deleteChronicle} className='yes'>Yes</button>
                    </div>
                </div>
            </div>
            }
            {toggleAddChronicles && <AddChroniclesPage toggle={toggleSearch}/>} 
            {chronicleStatus.map((title, index) => (
                <StatusContainer status={title} key={index} chroniclesStatus={categorizedChronicles[index]} 
                                 listOfChanges={listOfChanges} confirmDelete={toggleDelete} />
            ))}
        </div>
    </div>
  );
}
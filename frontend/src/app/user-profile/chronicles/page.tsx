/*
Future ToDo's for this section
    - get books from database
    - save books to redux
    - when a user edits the book section, it should save the result to redux (this way the state is saved)
    - there should also be a function that checks whether or not the input is valid for user chronicle changes
    - there should be a timer for sending changed requests to db since i don't want the user editing a million times and making a million requests to db

To-Do's I can implement right now:
    - check docs on what else I can consider adding right now
    - make delete button work 
    - split chronicles to sections, navigation, and individual read/watch status category
    - when users update/delete/add new entry, do not refresh, when users change chapter/watch date/rating can change but do not move from spot 
    - dividing novels into categories when clicking on different category
*/

"use client";
import { useState } from 'react';
import { MouseEvent } from 'react';
import StatusContainer from './StatusContainer';
export default function ChronicleCategoryLayout() {

    let UserChronicles : Record<number, Chronicle> = {};
    const chroniclesFromStorage = window.sessionStorage.getItem("UserChronicles");
    console.log(chroniclesFromStorage);
    if (chroniclesFromStorage === undefined || chroniclesFromStorage === null || chroniclesFromStorage === "" || chroniclesFromStorage === "{}") {
        UserChronicles = {
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

        window.sessionStorage.setItem("UserChronicles", JSON.stringify(UserChronicles));
    } else {
        UserChronicles = JSON.parse(chroniclesFromStorage);
    }
    // call function to get user's entries 
    // retrieve data from session storage
    const [chronicleStatus, setChronicleStatus] = useState(["Reading", "Completed", "Rereading", "Plan To Read", "Paused", "Dropped"]);
    const [categorizedChronicles, setCategorizedChronicles] = useState<Array<Array<Chronicle>>>(sortByStatus(UserChronicles));
    
    function sortByStatus(filteredChronicles: Record<number, Chronicle>) {
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
        let desiredMedium : Record<number, Chronicle> = {};

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
                const novelsOnly : Record<number, Chronicle> = filterUserChronicles("Novel");
                return novelsOnly;
            case 'Graphic Novels':
                const graphicNovelsOnly : Record<number, Chronicle> = filterUserChronicles("Graphic Novel");
                return graphicNovelsOnly;
            case 'Films':
                const filmsOnly : Record<number, Chronicle> = filterUserChronicles("Film");
                return filmsOnly;
            case 'Shows':
                const showsOnly : Record<number, Chronicle> = filterUserChronicles("Show");
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

  // when users edit, save changes to session storage
  // when the user closes the browser/reloads the browser update the database 
  return (
    <>
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
      <div className='user-container'>            
          {chronicleStatus.map((title, index) => (
            <StatusContainer status={title} key={index} chroniclesStatus={categorizedChronicles[index]} chronicles={UserChronicles}/>
          ))}
      </div>
      </>
  );
}
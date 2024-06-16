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
import UserChronicle from './UserChronicle';
export default function ChronicleCategoryLayout() {

    // call function to get user's entries 
    const userChronicles = 
    [
        {
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
        {
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
        {
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
        {
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
    ];

    // retrieve data from session storage
    const [chronicleStatus, setChronicleStatus] = useState(["Reading", "Completed", "Rereading", "Plan To Read", "Paused", "Dropped"]);
    const [chronicles, setUserChronicles] = useState<Array<Array<Chronicle>>>(sortByStatus(userChronicles));

    function sortByStatus(filteredChronicles: Array<Chronicle>) {
        let newArray = [];
        let statusMap: {[key: string]: number} = {};
        for (let i = 0; i < chronicleStatus.length; i++) {
            newArray.push([]);
            statusMap[chronicleStatus[i]] = i;
        }

        for (let a = 0; a < filteredChronicles.length; a++) {
            const chronicle = filteredChronicles[a];
            const status = chronicle.status;
            const index = statusMap[status];
            newArray[index] = [...newArray[index], chronicle];
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

    function filterChroniclesByMedium(mediumType: string) {
        switch(mediumType){
            case 'Novels':
                const novelsOnly = userChronicles.filter(chronicle => chronicle.category == "Novel");
                return novelsOnly;
            case 'Graphic Novels':
                const graphicNovelsOnly = userChronicles.filter(chronicle => chronicle.category == "Graphic Novel");
                return graphicNovelsOnly;
            case 'Films':
                const filmsOnly = userChronicles.filter(chronicle => chronicle.category == "Film");
                return filmsOnly;
            case 'Shows':
                const showsOnly = userChronicles.filter(chronicle => chronicle.category == "Show");
                return showsOnly;
            default: 
                return userChronicles;
        }
    }

    function mediumChange(e: MouseEvent<HTMLDivElement, Event>, index: number, medium: string) {
        cssFolderEffect(e, index);
        let filteredChronicles = filterChroniclesByMedium(medium);
        let sortedChronicles = sortByStatus(filteredChronicles);
        setUserChronicles(sortedChronicles);
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
              <div className='user-container-section' key={index}>
                  <h1 className='user-section-title'>{title}</h1>
                  <p className='user-container-category'>Title</p>
                  <p className='user-container-category'>Score</p>
                  <p className='user-container-category'>Episodes</p>
                  <p className='user-container-category'>Category</p>
                  <p className='user-container-category'>Last Read</p>
                  <ul className='chronicle-status-list'>
                    {chronicles.length > 0 && chronicles[index].map(item => (
                        <UserChronicle UserChronicleId={item.userChronicleId} item={item}/>
                    ))}
                  </ul>
              </div>
          ))}
      </div>
      </>
  );
}
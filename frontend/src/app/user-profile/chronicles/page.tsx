/*
Future ToDo's for this section
    - get books from database
    - save books to session storage
    - when a user edits the book section, it should save the result to sessionstorage (this way the state is saved)
    - there should also be a function that checks whether or not the input is valid for user chronicle changes
    - there should be a timer for sending changed requests to db since i don't want the user editing a million times and making a million requests to db

To-Do's I can implement right now:
    - dividing novels into categories when clicking on different category
*/

"use client";
import { useState } from 'react';
import { MouseEvent } from 'react';
export default function ChronicleCategoryLayout() {
    interface Chronicle {
        title: string;
        rating: number;
        start_date: Date;
        last_read: string;
        chapter: number;
        img_src: string;
        notes: string;
        category: string;
        status: string;
    }

    // call function to get user's entries 
    const userChronicles = 
    [
        {
            title: "Harry Potter and the deathly hallows ",
            rating: 4, // Just an example rating
            start_date: new Date(), // Current date as an example
            last_read: "2023-04-22", // Example last read date
            chapter: 10, // Example chapter
            img_src: "https://example.com/harry.jpg", // Example image URL
            notes: "This is a great book!", // Example notes
            category: "Novel", // Example category
            status: "Reading" // Example status
        },
        {
            title: "Example Title",
            rating: 5, // Just an example rating
            start_date: new Date(), // Current date as an example
            last_read: "2023-02-28", // Example last read date
            chapter: 20, // Example chapter
            img_src: "https://example.com/example.jpg", // Example image URL
            notes: "This book is amazing!", // Example notes
            category: "Graphic Novel", // Example category
            status: "Completed" // Example status
        },
        {
            title: "Another Example",
            rating: 4, // Just an example rating
            start_date: new Date(), // Current date as an example
            last_read: "2023-01-10", // Example last read date
            chapter: 15, // Example chapter
            img_src: "https://example.com/another-example.jpg", // Example image URL
            notes: "Enjoyed reading this one", // Example notes
            category: "Graphic Novel", // Example category
            status: "Completed" // Example status
        },
        {
        title: "Sun Zhu - The Art of Testing",
        rating: 3, // Just an example rating
        start_date: new Date(), // Current date as an example
        last_read: "2023-03-15", // Example last read date
        chapter: 5, // Example chapter
        img_src: "https://example.com/default.jpg", // Example image URL
        notes: "Good book so far", // Example notes
        category: "Film", // Example category
        status: "Reading" // Example status
    }
    ];

    const titles = [
    {category: "About", index: 0, link: "/user-profile"},
    {category: "Chronicles", index: 1, link: "/user-profile/chronicles"},
    {category: "History", index: 2, link:"/user-profile/history"},
    {category: "Statistics", index: 3, link:"/user-profile/statistics"}
    ]

    // retrieve data from session storage
    const [chronicleStatus, setChronicleStatus] = useState(["Reading", "Completed", "Plan To Read", "Dropped"]);
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
                  <p className='user-container-category pOne'>Title</p>
                  <p className='user-container-category'>Score</p>
                  <p className='user-container-category'>Chapters Read</p>
                  <p className='user-container-category'>Last Read</p>
                  <ul className='chronicle-status-list'>
                    {chronicles.length > 0 && chronicles[index].map((item, i) => (
                        <li className='user-container-item' key={i}>
                            <p className='chronicle-title chronicle-status-list-info'>{item.title}</p>
                            <p className='chronicle-status-list-info' contentEditable suppressContentEditableWarning={true}>{item.rating}</p>
                            <p className='chronicle-status-list-info' contentEditable suppressContentEditableWarning={true}>{item.chapter}</p>
                            <p className='chronicle-status-list-info'contentEditable suppressContentEditableWarning={true}>{item.last_read}</p>
                        </li>
                    ))}
                  </ul>
              </div>
          ))}
      </div>
      </>
  );
}
"use client";
import React, { useState } from 'react';

type Props = {
  chronicles: {title: string; rating: number, start_date: Date, last_read: string, chapter: number, img_src: string, notes: string, category: string, status: string}[];
}

export default function ChronicleCategoryLayout() {
  // call function to get user's entries 
  const userChronicles = 0;
  const [chronicles, setUserChronicles] = useState([
    [
        {
            title: "Harry Potter and the deathly hallows ",
            rating: 4, // Just an example rating
            start_date: new Date(), // Current date as an example
            last_read: "2023-04-22", // Example last read date
            chapter: 10, // Example chapter
            img_src: "https://example.com/harry.jpg", // Example image URL
            notes: "This is a great book!", // Example notes
            category: "Fantasy", // Example category
            status: "Reading" // Example status
        },
        {
            title: "",
            rating: 3, // Just an example rating
            start_date: new Date(), // Current date as an example
            last_read: "2023-03-15", // Example last read date
            chapter: 5, // Example chapter
            img_src: "https://example.com/default.jpg", // Example image URL
            notes: "Good book so far", // Example notes
            category: "Fantasy", // Example category
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
            category: "Science Fiction", // Example category
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
            category: "Mystery", // Example category
            status: "Completed" // Example status
        }
    ],
    [],
    [],
    []
  ]);

  const [chronicleStatus, setChronicleStatus] = useState(["Reading", "Completed", "Plan To Read", "Dropped"]);
  console.log(chronicles);

  return (
      <div className='user-chronicles-container'>            
          {chronicleStatus.map((title, index) => (
              <div className='user-chronicles-container-section' key={index}>
                  <h1>{title}</h1>
                  <p className='user-chronicles-container-category pOne'>Title</p>
                  <p className='user-chronicles-container-category'>Score</p>
                  <p className='user-chronicles-container-category'>Chapters Read</p>
                  <p className='user-chronicles-container-category'>Last Read</p>
                  <ul className='chronicle-status-list'>
                    {chronicles.length != undefined && chronicles[index].map((item, i) => (
                        <li className='user-chronicles-container-item' key={i}>
                            <p className='chronicle-title chronicle-status-list-info'>{item.title}</p>
                            <p className='chronicle-status-list-info'>{item.rating}</p>
                            <p className='chronicle-status-list-info'>{item.chapter}</p>
                            <p className='chronicle-status-list-info'>{item.last_read}</p>
                        </li>
                    ))}
                  </ul>
              </div>
          ))}
      </div>
  );
}
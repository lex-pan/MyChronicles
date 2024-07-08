// can add a search bar
// can add a delete history button
"use client";
import { useState } from 'react';

export default function UserHistory() {
    // need an api to call history
    let getHistory = [
      {
        title: "Harry Potter and The Philosopher's Stone",
        chapter: 38,
        date: "2024-04-25",
        link: "http://localhost:3000/user-profile/history",
      },
      {
        title: "testing testing",
        chapter: 38,
        date: "2024-04-25",
        link: "http://localhost:3000/user-profile/history",
      },
      {
        title: "testing testing",
        chapter: 38,
        date: "2024-04-25",
        link: "http://localhost:3000/user-profile/history",
      },
      {
        title: "testing testing",
        chapter: 38,
        date: "2024-04-25",
        link: "http://localhost:3000/user-profile/history",
      },
    ]

    let [history, setHistory] = useState(getHistory);

    return (
      <div className="user-container history">
        <div className="user-history-section">
          <h1 className="user-section-title">History</h1>
          <p className="user-container-category pTwo">Title</p>
          <p className="user-container-category pFour">Chapter</p>
          <p className="user-container-category pFour">Date</p>
          <p className="user-container-category pThree pFour">Link</p>
          <ul className='chronicle-status-list '>
            {history.length > 0 && history.map((item, i) => (
                <li className='user-container-item' key={i}>
                    <p className='chronicle-title user-chronicle-info'>{item.title}</p>
                    <p className='user-chronicle-info'>{item.chapter}</p>
                    <p className='user-chronicle-info'>{item.date}</p>
                    <p className='chronicle-title user-chronicle-info'>{item.link}</p>
                </li>
            ))}
          </ul>
        </div>
        
      </div>
    );
  }
  
'use client'
import { UserHistoryData } from "@/app/utils/interfaces";
import { useEffect, useRef, useState } from "react";
import convertDatetoReadble from "@/app/utils/convenientFunctions";
import apiLink from '@/app/utils/apiLink';

interface userHistoryProps {
    history: Array<UserHistoryData>
    username: string
}

async function retrieveUserHistory(username: string, pageNumber: number) {
    console.log("retrieve more history!!");
    const userHistory = await fetch(`${apiLink}/user/${username}/history/${pageNumber}`, {
      method: 'GET',
      headers: {
          'Accept': 'application/json' // Example: Accept JSON responses
      }
    });
  
    return userHistory.json();
  }

export default function UserHistory({history, username} : userHistoryProps) {
    const dbPageCount = useRef(1);
    const semaphore = useRef(true);
    const remainingHistory = useRef(true);
    const [userHistory, setUserHistory] = useState<Array<UserHistoryData>>(() => history);

    useEffect(() => {
        async function onscroll() {
            if (window.scrollY + window.innerHeight == document.body.scrollHeight && remainingHistory.current && semaphore.current) {
                semaphore.current = false;
                let result : Array<UserHistoryData> = await retrieveUserHistory(username, dbPageCount.current);
                dbPageCount.current = dbPageCount.current + 1;
                setUserHistory(previousList => [...previousList, ...result]);                

                if (result.length < 100) {
                    remainingHistory.current = false;
                }
            }

            semaphore.current = true;
        }

        window.addEventListener("scroll", onscroll);

        return () => {
            document.removeEventListener('scroll', onscroll);
        };
    }, [username]);

    return (
    <div className="user-container history">
        <div className="user-history-section">
        <h1 className="user-section-title">History</h1>
        <div className='user-container-attributes chronicle-attribute-names'>
            <p className="user-container-category">Title</p>
            <p className="user-container-category">Chapter</p>
            <p className="user-container-category">Action</p>
            <p className="user-container-category">Date</p>
        </div>
        <ul className='user-history '>
            {userHistory.length > 0 && userHistory.map((item, i) => (
                <li className='user-history-item' key={i}>
                    <p className='chronicle-attributes chronicle-first-column user-history-attribute'>{item.title}</p>
                    <p className='chronicle-attributes user-history-attribute'>{item.chapter}</p>
                    <p className='chronicle-attributes user-history-attribute'>{item.action}</p>
                    <p className='chronicle-attributes user-history-attribute'>{convertDatetoReadble(item.date_of_action)}</p>
                    <a className='chronicle-attributes user-history-attribute' href={item.url}>Link</a>
                </li>
            ))}
        </ul>
        </div>
        
    </div>
    );
};
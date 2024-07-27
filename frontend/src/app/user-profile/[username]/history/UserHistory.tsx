'use client'
import { UserHistoryData } from "@/app/utils/interfaces";
import { useState } from "react";
import convertDatetoReadble from "@/app/utils/convenientFunctions";

interface userHistoryProps {
    history: Array<UserHistoryData>
}

export default function UserHistory({history} : userHistoryProps) {
    console.log(history);
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
            {history.length > 0 && history.map((item, i) => (
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
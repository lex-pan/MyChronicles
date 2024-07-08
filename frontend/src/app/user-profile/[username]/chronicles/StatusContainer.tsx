import UserChronicle from "./UserChronicle"
import { useState, useEffect } from "react"
import { StatusContainerProps, UserChronicleData } from "@/app/utils/interfaces";

export default function({status, chroniclesStatus, listOfChanges, confirmDelete} : StatusContainerProps) {
    return (
        <div className='user-container-section'>
            <h1 className='user-section-title'>{status}</h1>
            <p className='user-container-category'>Title</p>
            <p className='user-container-category'>Score</p>
            <p className='user-container-category'>Episodes</p>
            <p className='user-container-category'>Status</p>
            <p className='user-container-category'>Last Read</p>
            <ul className='chronicle-list'>
            {chroniclesStatus.length > 0 && chroniclesStatus.map(item => (
                <UserChronicle key={item.userChronicleId} item={item} confirmDelete={confirmDelete} listOfChanges={listOfChanges}/>
            ))}
            </ul>
        </div>
    )
}


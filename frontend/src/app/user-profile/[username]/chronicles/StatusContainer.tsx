import UserChronicle from "./UserChronicle"
import { useState, useEffect } from "react"
import { StatusContainerProps, UserChronicleData } from "@/app/utils/interfaces";

export default function({status, chroniclesStatus, confirmDelete, profileUsername, profileUC} : StatusContainerProps) {
    return (
        <>
        {chroniclesStatus != undefined && Object.keys(chroniclesStatus).length > 0 &&
            <div className='user-container-section'>
                <h1 className='user-section-title'>{status}</h1>
                <p className='user-container-category'>Title</p>
                <p className='user-container-category'>Score</p>
                <p className='user-container-category'>Episodes</p>
                <p className='user-container-category'>Status</p>
                <p className='user-container-category'>Last Read</p>
                <ul className='chronicle-list'>
                {Object.values(chroniclesStatus).map(item => (
                    <UserChronicle key={item.book_id} item={item} confirmDelete={confirmDelete} profileUsername={profileUsername} profileUC={profileUC}/>
                ))}
                </ul>
            </div>
        }
        </>
    )
}


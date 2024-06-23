import UserChronicle from "./UserChronicle"
import { useState, useEffect } from "react"
import { StatusContainerProps, UserChronicleData } from "@/app/utils/interfaces";

export default function({status, chroniclesStatus, chronicles, listOfChanges} : StatusContainerProps) {
    // when updating chronicles (remove, add, change) update chronicles
    // when deleting 

    const [chroniclesMatchingStatus, setChroniclesMatchingStatus] = useState<Array<UserChronicleData>>(chroniclesStatus);

    useEffect(() => {
        setChroniclesMatchingStatus(chroniclesStatus);
    }, [chroniclesStatus]);

    function removeChronicle(userChronicleId : number) {
        const filtered = chroniclesMatchingStatus.filter(chronicle => chronicle.userChronicleId !== userChronicleId);
        setChroniclesMatchingStatus(filtered);
        // delete from db
    }

    return (
        <div className='user-container-section'>
            <h1 className='user-section-title'>{status}</h1>
            <p className='user-container-category'>Title</p>
            <p className='user-container-category'>Score</p>
            <p className='user-container-category'>Episodes</p>
            <p className='user-container-category'>Status</p>
            <p className='user-container-category'>Last Read</p>
            <ul className='chronicle-list'>
            {chroniclesMatchingStatus.length > 0 && chroniclesMatchingStatus.map(item => (
                <UserChronicle key={item.userChronicleId} item={item} removeChronicle={removeChronicle} listOfChanges={listOfChanges}/>
            ))}
            </ul>
        </div>
    )
}


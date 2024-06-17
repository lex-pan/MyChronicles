import UserChronicle from "./UserChronicle"
import { useState, useEffect } from "react"

export default function({status, chroniclesStatus, chronicles} : StatusContainerProps) {
    // when updating chronicles (remove, add, change) update chronicles
    // when deleting 

    const [chroniclesMatchingStatus, setChroniclesMatchingStatus] = useState<Array<Chronicle>>(chroniclesStatus);

    useEffect(() => {
        setChroniclesMatchingStatus(chroniclesStatus);
    }, [chroniclesStatus]);

    function removeChronicle(userChronicleId : number) {
        const filtered = chroniclesMatchingStatus.filter(chronicle => chronicle.userChronicleId !== userChronicleId);
        setChroniclesMatchingStatus(filtered);
        delete chronicles[userChronicleId];
        sessionStorage.setItem("UserChronicles", JSON.stringify(chronicles));
    }

    return (
        <div className='user-container-section'>
            <h1 className='user-section-title'>{status}</h1>
            <p className='user-container-category'>Title</p>
            <p className='user-container-category'>Score</p>
            <p className='user-container-category'>Episodes</p>
            <p className='user-container-category'>Category</p>
            <p className='user-container-category'>Last Read</p>
            <ul className='chronicle-status-list'>
            {chroniclesMatchingStatus.length > 0 && chroniclesMatchingStatus.map(item => (
                <UserChronicle key={item.userChronicleId} item={item} removeChronicle={removeChronicle}/>
            ))}
            </ul>
        </div>
    )
}


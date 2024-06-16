import { useState } from "react"

export default function UserChronicle({UserChronicleId, item} : UserChronicleProps) {
    const [detailedInfo, setDetailedInfo] = useState(false);

    function toggleInfo() {
        setDetailedInfo(state => !state);
    }

    return (
        <li className='user-container-item' key={UserChronicleId}>
            <div className='user-container-overview'>
                <p className='chronicle-title user-chronicle-info'>{item.title}</p>
                <p className='user-chronicle-info' contentEditable suppressContentEditableWarning={true}>{item.rating}</p>
                <p className='user-chronicle-info' contentEditable suppressContentEditableWarning={true}>{item.episode}</p>
                <p className='user-chronicle-info'>{item.category}</p>
                <p className='user-chronicle-info'contentEditable suppressContentEditableWarning={true}>{item.last_read}</p>
                <button onClick={toggleInfo} className='chronicle-list-more-info-button'>v</button>
                <button className='chronicle-list-broader'></button>
            </div>
            {detailedInfo && 
                <div className='chronicle-list-more-info'>
                    <p className='user-chronicle-text'>Start Date: {item.start_date}</p>
                    <p className='user-chronicle-text'>Review</p>
                    <textarea className="user-chronicle-textarea" placeholder="Write your review here"></textarea>
                    <p className='user-chronicle-text'>Notes</p>
                    <textarea className="user-chronicle-textarea" placeholder="Write your notes here"></textarea>
                </div>
            }
        </li>
    )
}
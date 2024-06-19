import { useState, useEffect } from "react"

export default function UserChronicle({item, removeChronicle, listOfChanges} : UserChronicleProps) {
    const [detailedInfo, setDetailedInfo] = useState(false);
    
    // get the id
    // check out what has been changed
    // add it to listOfChanges 
    function updateChronicle(e: React.ChangeEvent<any>, chronicleDetail : string) {
        let inputValue = e.target.value;
        let inputNumber = 0;

        if (!isNaN(parseFloat(inputValue))) {
            inputNumber = parseFloat(inputValue);
            inputNumber = Math.round(inputNumber * 10)/10
            e.target.value = inputNumber.toString();
        }

        if (chronicleDetail == "rating") {
            if (inputNumber < 1) {
                e.target.value = "1";
            } else if (inputNumber > 5) {
                e.target.value = "5";
            }
        }

        if (chronicleDetail == "status") {
            e.target.value = inputValue;
        }

        switch(chronicleDetail){
            case 'rating':
            case 'episode':
                if (inputNumber != item[chronicleDetail]) {
                    if (item.userChronicleId in listOfChanges) {
                        listOfChanges[item.userChronicleId] = {...listOfChanges[item.userChronicleId], [chronicleDetail]: inputNumber};
                    } else {
                        listOfChanges[item.userChronicleId] = {[chronicleDetail]: inputNumber};
                    }
                }

                if (inputNumber == item[chronicleDetail] && item.userChronicleId in listOfChanges && chronicleDetail in listOfChanges[item.userChronicleId]) {
                    delete listOfChanges[item.userChronicleId][chronicleDetail];
                }
                break;
            case 'status':
            case 'last_read':
            case 'start_date':
            case 'review':
            case 'notes':
                if (inputValue != item[chronicleDetail]) {
                    if (item.userChronicleId in listOfChanges) {
                        listOfChanges[item.userChronicleId] = {...listOfChanges[item.userChronicleId], [chronicleDetail]: inputValue};
                    } else {
                        listOfChanges[item.userChronicleId] = {[chronicleDetail]: inputValue};
                    }
                }
                
                if (inputValue == item[chronicleDetail] && item.userChronicleId in listOfChanges && chronicleDetail in listOfChanges[item.userChronicleId]) {
                    delete listOfChanges[item.userChronicleId][chronicleDetail];
                }
                break;
            default: 
                return "A non existing chronicle info section was given";
        }

        console.log(listOfChanges);

    }

    function toggleInfo() {
        setDetailedInfo(state => !state);
    }

    return (
        <li className='user-container-item'>
            <div className='user-container-overview'>
                <button onClick={() => removeChronicle(item.userChronicleId)} className='chronicle-list-broader'></button>
                <p className='chronicle-title user-chronicle-info'>{item.title}</p>
                <input className="user-chronicle-info-small" onBlur={(e) => updateChronicle(e, "rating")} defaultValue={item.rating ?? "-"} />
                <input className="user-chronicle-info-small" onBlur={(e) => updateChronicle(e, "episode")} defaultValue={item.episode ?? "-"} />
                <select className="user-chronicle-info" onChange={(e) => updateChronicle(e, "status")} defaultValue={item.status}>
                    <option value="Reading">Reading</option>
                    <option value="Completed">Completed</option>
                    <option value="Paused">Paused</option>
                    <option value="Dropped">Dropped</option>
                    <option value="Plan To Read">Plan to Read</option>
                    <option value="Rereading">Rereading</option>
                </select>
                <input type="date" className="user-chronicle-info" onBlur={(e) => updateChronicle(e, "last_read")} defaultValue={item.last_read} />
                <button onClick={toggleInfo} className='chronicle-list-more-info-button'>v</button>
            </div>
            {detailedInfo && 
                <div className='chronicle-list-more-info'>
                    <div className="more-info-first-line">
                        <p className='user-chronicle-text'>Start Date:</p>
                        <input type="date" className="user-chronicle-date" onBlur={(e) => updateChronicle(e, "start_date")} defaultValue={item.start_date} />
                        <p className='user-chronicle-text'>Category: {item.category}</p>
                    </div>
                    <p className='user-chronicle-text'>Review</p>
                    <textarea className="user-chronicle-textarea" onBlur={(e) => updateChronicle(e, "review")} placeholder="Write your review here" defaultValue={item.review}></textarea>
                    <p className='user-chronicle-text'>Notes</p>
                    <textarea className="user-chronicle-textarea" onBlur={(e) => updateChronicle(e, "notes")} placeholder="Write your notes here" defaultValue={item.notes}></textarea>
                </div>
            }
        </li>
    )
}
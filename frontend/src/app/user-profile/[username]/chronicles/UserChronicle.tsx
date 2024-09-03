import { useState, useEffect } from "react"
import { UserChronicleProps, AdditionalInfoUC } from "@/app/utils/interfaces";
import { useAppDispatch, useAppStore, useAppSelector } from '../../../../globalRedux/hooks';
import { updateExistingId, updateNewId } from "@/globalRedux/features/User/UserChroniclesSlice";
import Link from "next/link";
import apiLink from '@/app/utils/apiLink';

export default function UserChronicle({item, confirmDelete, profileUsername, profileUC} : UserChronicleProps) {
    let listOfChanges = useAppSelector((state) => state.UserChronicles.listOfChanges);
    let viewersUsername = useAppSelector((state) => state.UserChronicles.username);
    const [detailedInfo, setDetailedInfo] = useState(false);
    const [additional_info, set_additional_info] = useState<AdditionalInfoUC | null>(null);
    let dispatch = useAppDispatch();
    // get the id
    // check out what has been changed
    // add it to listOfChanges 
    function updateChronicle(e: React.ChangeEvent<any>, chronicleDetail : string) {
        let inputValue = e.target.value;
        let inputNumber : number | null = 0;

        if (!isNaN(parseFloat(inputValue)) ) {
            console.log(inputValue);
            if (inputValue[inputValue.length-1] == ".") {
                return 
            }
            inputNumber = parseFloat(inputValue);
            inputNumber = Math.round(inputNumber * 10)/10
            console.log(inputNumber);
            e.target.value = inputNumber.toString();
        }

        if (chronicleDetail == "rating") {
            if (isNaN(inputValue) && inputValue != "") {
                e.target.value = "";
                return
            } else if (inputValue == "") {
                inputNumber = null;
            } else if (inputNumber < 1) {
                inputNumber = 1;
                e.target.value = "1";
            } else if (inputNumber > 5) {
                inputNumber = 5;
                e.target.value = "5";
            }
        }

        if (chronicleDetail == "episode" && inputValue == "") {
            inputNumber = null;
        }
        
        if (chronicleDetail == "status") {
            e.target.value = inputValue;
        }

        if (chronicleDetail == "last_read" || chronicleDetail == "start_date") {
            e.target.value = inputValue;
        }

        switch(chronicleDetail){
            case 'rating':
            case 'episode':
                if (inputNumber != item[chronicleDetail]) {
                    if (item.book_id in listOfChanges) {
                        dispatch(updateExistingId({id: item.book_id, chronicleDetail: chronicleDetail, changedAttributeValue: (inputNumber == null ? inputNumber : inputNumber.toString())}));
                        if (profileUC != undefined) {
                            profileUC[item.book_id][chronicleDetail] = inputNumber; 
                        }
                    } else {
                        dispatch(updateNewId({id: item.book_id, chronicleDetail: chronicleDetail, changedAttributeValue: (inputNumber == null ? inputNumber : inputNumber.toString())}));
                        if (profileUC != undefined) {
                            profileUC[item.book_id][chronicleDetail] = inputNumber; 
                        }
                    }
                }

                break;
            case 'status':
            case 'last_read':
                if (inputValue != item[chronicleDetail]) {
                    if (item.book_id in listOfChanges) {
                        dispatch(updateExistingId({id: item.book_id, chronicleDetail: chronicleDetail, changedAttributeValue: inputValue}));
                        if (profileUC != undefined) {
                            profileUC[item.book_id][chronicleDetail] = inputValue; 
                        }
                    } else {
                        dispatch(updateNewId({id: item.book_id, chronicleDetail: chronicleDetail, changedAttributeValue: inputValue}));
                        if (profileUC != undefined) {
                            profileUC[item.book_id][chronicleDetail] = inputValue; 
                        }
                    }
                }
                
                break;
            case 'start_date':
            case 'review':
            case 'notes':
                if (inputValue != additional_info?.[chronicleDetail]) {
                    if (item.book_id in listOfChanges) {
                        dispatch(updateExistingId({id: item.book_id, chronicleDetail: chronicleDetail, changedAttributeValue: inputValue}));
                    } else {
                        dispatch(updateNewId({id: item.book_id, chronicleDetail: chronicleDetail, changedAttributeValue: inputValue}));
                    }
                }
                
                break;
            default: 
                return "A non existing chronicle info section was given";
        }

    }

    async function toggleInfo() {
        if (additional_info == null) {
            let response : AdditionalInfoUC = await retrieveAdditionalInfo(); 
            set_additional_info(response);
            console.log(response);
        }
        
        setDetailedInfo(state => !state);
    }

    async function retrieveAdditionalInfo() {
        const response = await fetch(`${apiLink}/user/${profileUsername}/chronicles/additional/${item.book_id}`, {
            method: 'GET',
            credentials: 'include', // Include cookies with the request
          });
        console.log("api was called");
        return response.json();
    }
    
    return (
        <>
        {viewersUsername == profileUsername &&
        <li className='user-container-item'>
            <div className='user-container-overview'>
                <button onClick={() => confirmDelete(item)} className='chronicle-list-broader'></button>
                <Link href={`/chronicle/${item.book_id}`} className='chronicle-title user-chronicle-info'>{item.book_name}</Link>
                <input className="user-chronicle-info-small" onChange={(e) => updateChronicle(e, "rating")} defaultValue={item.rating ?? ""} placeholder="-"/>
                <input className="user-chronicle-info-small" onChange={(e) => updateChronicle(e, "episode")} defaultValue={item.episode ?? ""} placeholder="-"/>
                <select className="user-chronicle-info" onChange={(e) => updateChronicle(e, "status")} defaultValue={item.status}>
                    <option value="Reading">Reading</option>
                    <option value="Completed">Completed</option>
                    <option value="Paused">Paused</option>
                    <option value="Dropped">Dropped</option>
                    <option value="Plan to Read">Plan to Read</option>
                    <option value="Rereading">Rereading</option>
                    <option value="-">-</option>
                </select>
                <input type="date" className="user-chronicle-info" onBlur={(e) => updateChronicle(e, "last_read")} defaultValue={item.last_read != "" && item.last_read != "0001-01-01T00:00:00" ? new Date(item.last_read).toISOString().split('T')[0] : undefined} />
                <button onClick={toggleInfo} className='chronicle-list-more-info-button'>v</button>
            </div>
            {detailedInfo && 
                <div className='chronicle-list-more-info'>
                    <div className="more-info-first-line">
                        <p className='user-chronicle-text'>Start Date:</p>
                        <input type="date" className="user-chronicle-date" onBlur={(e) => updateChronicle(e, "start_date")} defaultValue={listOfChanges[item.book_id] && "start_date" in listOfChanges[item.book_id] ? listOfChanges[item.book_id]["start_date"] : (additional_info?.start_date && additional_info.start_date != "" && !additional_info.start_date.includes("0001-01-01")  ? new Date(additional_info?.start_date).toISOString().split('T')[0] : undefined)} />
                        <p className='user-chronicle-text'>Category: {item.entertainment_category}</p>
                    </div>
                    <p className='user-chronicle-text'>Review</p>
                    <textarea className="user-chronicle-textarea" onChange={(e) => updateChronicle(e, "review")} placeholder="Write your review here" defaultValue={listOfChanges[item.book_id] && "review" in listOfChanges[item.book_id] ? listOfChanges[item.book_id]["review"] : additional_info?.review}></textarea>
                    <p className='user-chronicle-text'>Notes</p>
                    <textarea className="user-chronicle-textarea" onChange={(e) => updateChronicle(e, "notes")} placeholder="Write your notes here" defaultValue={listOfChanges[item.book_id] && "notes" in listOfChanges[item.book_id] ? listOfChanges[item.book_id]["notes"] : additional_info?.notes}></textarea>
                </div>
            }
        </li>
        }
        {viewersUsername != profileUsername &&
        <li className='user-container-item'>
            <div className='user-container-overview'>
                <button className='chronicle-list-broader invisible'></button>
                <p className='chronicle-title user-chronicle-info'>{item.book_name}</p>
                <input className="user-chronicle-info-small" defaultValue={item.rating ?? ""} placeholder="-" disabled/>
                <input className="user-chronicle-info-small" defaultValue={item.episode ?? ""} placeholder="-" disabled/>
                <select className="user-chronicle-info" defaultValue={item.status} disabled>
                    <option value="Reading">Reading</option>
                    <option value="Completed">Completed</option>
                    <option value="Paused">Paused</option>
                    <option value="Dropped">Dropped</option>
                    <option value="Plan to Read">Plan to Read</option>
                    <option value="Rereading">Rereading</option>
                    <option value="-">-</option>
                </select>
                <input type="date" className="user-chronicle-info" defaultValue={item.last_read != "" && !item.last_read.includes("0001-01-01") ? new Date(item.last_read).toISOString().split('T')[0] : undefined} disabled/>
                <button onClick={toggleInfo} className='chronicle-list-more-info-button'>v</button>
            </div>
            {detailedInfo && 
                <div className='chronicle-list-more-info'>
                    <div className="more-info-first-line">
                        <p className='user-chronicle-text'>Start Date:</p>  
                        <input type="date" className="user-chronicle-date" defaultValue={additional_info?.start_date && additional_info.start_date != "0001-01-01" ? new Date(additional_info?.start_date).toISOString().split('T')[0] : undefined} disabled/>
                        <p className='user-chronicle-text'>Category: {item.entertainment_category}</p>
                    </div>
                    <p className='user-chronicle-text'>Review</p>
                    <textarea className="user-chronicle-textarea" placeholder="Write your review here" defaultValue={additional_info?.review} disabled></textarea>
                    <p className='user-chronicle-text'>Notes</p>
                    <textarea className="user-chronicle-textarea" placeholder="Write your notes here" defaultValue={additional_info?.notes} disabled></textarea>
                </div>
            }
        </li>
        }
        </>
    )
}
import { useEffect, useState } from "react"
import { SearchedChronicle } from "@/app/utils/interfaces";
import { useAppStore, useAppDispatch } from "@/globalRedux/hooks";
import { addUC } from "@/globalRedux/features/User/UserChroniclesSlice";
import { UserChronicle } from "@/app/utils/interfaces";

export default function AddChronicleItem({searched_chronicle, setCategorizedChronicles, sortByStatus, profileUC} : SearchedChronicle) {
    const [toggledChronicle, setToggledChronicle] = useState(false);
    const [inLibrary, setInLibrary] = useState(false);
    const reduxLibrary = useAppStore();
    const dispatch = useAppDispatch();

    useEffect(() => {
        let viewerUC = reduxLibrary.getState().UserChronicles.userChronicles;

        if (searched_chronicle.chronicle_id in viewerUC) {
            setInLibrary(true);
        } else {
            setInLibrary(false);
        }
    }, [reduxLibrary, searched_chronicle.chronicle_id]);

    function toggleChronicle() {
        setToggledChronicle(toggleStatus => !toggleStatus);
    }

    async function addUserChronicle(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log(e.currentTarget[5].innerHTML);

        const formData = new FormData(e.currentTarget);
        const status = formData.get('status');
        let rating = formData.get('rating');
        const review = formData.get('review');
        let episode = formData.get('episode');
        
        const addChronicleToUC = await fetch('http://localhost:5172/user/chronicles/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/text' // Example: Accept JSON responses
            },
            credentials: 'include',
            body: JSON.stringify({
                "chronicle_id": searched_chronicle.chronicle_id,
                "status": status,
                "rating": rating,
                "review": review,
                "episode": episode,
                "start_date": "",
                "last_read": "",
                "notes": ""
            })
        });

        let converted_rating = rating?.toString();
        let converted_episode = episode?.toString();

        let newUC : UserChronicle = {
            book_id: searched_chronicle.chronicle_id,
            book_name: searched_chronicle.chronicle_title,
            entertainment_category: searched_chronicle.entertainment_category,
            episode: converted_episode ? parseFloat(converted_episode) : null,
            last_read: "",
            rating: converted_rating ? parseFloat(converted_rating) : null,
            userChronicleForDelete: null,
            status: status?.toString() ?? "-"
        };

        dispatch(addUC({id: searched_chronicle.chronicle_id, newUC}));

        if (profileUC) {
            profileUC[searched_chronicle.chronicle_id] = newUC; 
        } else {
            profileUC = {};
            profileUC[searched_chronicle.chronicle_id] = newUC; 
        }

        setCategorizedChronicles(sortByStatus(profileUC));

        toggleChronicle();
        // send api call to database to save 
        // unable to update current entries because we don't have a generated UserChroniclesId unless we create one ourselves  
    }

    return(
        <div className='add-chronicle-item'>
            <p className='add-chronicle-item-top'>{searched_chronicle.chronicle_title}</p>
            <p className='add-chronicle-item-top'>{searched_chronicle.entertainment_category}</p>
            <p className='add-chronicle-item-top'>{searched_chronicle.year ?? "N/A"}</p>
            <button className='add-chronicle-item-top-button' onClick={toggleChronicle}>+</button>
            {toggledChronicle &&
                <form className="add-chronicle-additional" onSubmit={(e) => addUserChronicle(e)}>
                    <div className="add-chronicle-additional-info">
                        <p>Director: {searched_chronicle.creator ?? "N/A"}</p>
                        <p>Country: {searched_chronicle.country ?? "N/A"}</p>
                    </div>
                    <div className="add-chronicle-bottom-first">
                        <p>Status</p>
                        <select name="status">
                            <option value="Reading">Reading</option>
                            <option value="Completed">Completed</option>
                            <option value="Paused">Paused</option>
                            <option value="Dropped">Dropped</option>
                            <option value="Plan to Read">Plan to Read</option>
                            <option value="Rereading">Rereading</option>
                            <option value="-">-</option>
                        </select>
                        <p>Episode</p>
                        <input name="episode" type="number"></input>
                        <p>Rating</p>
                        <input name="rating" type="number" min="1" max="5" step="0.5"></input>
                    </div>
                    <p className="add-chronicle-item-middle">Review</p>
                    <textarea name="review" className="add-chronicle-textarea" placeholder="Write your review here"></textarea>
                    <div className="add-chronicles-item-bottom">
                        <button className="add-chronicle-button" onClick={toggleChronicle}>Cancel</button>
                        {  inLibrary &&
                            <button className="add-chronicle-button">Already In Library</button>
                        }
                        { !inLibrary &&
                            <button className="add-chronicle-button" type="submit" value="submit">Submit</button>
                        }
                    </div>
                </form>
            }
        </div>
    )
}
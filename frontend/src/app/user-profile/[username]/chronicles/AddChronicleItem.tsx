import { useEffect, useState } from "react"
import { SearchedChronicle } from "@/app/utils/interfaces";
import { useAppStore } from "@/globalRedux/hooks";

export default function AddChronicleItem({searched_chronicle} : SearchedChronicle) {
    const [toggledChronicle, setToggledChronicle] = useState(false);
    const [inLibrary, setInLibrary] = useState(false);
    const reduxLibrary = useAppStore();

    useEffect(() => {
        let viewerUC = reduxLibrary.getState().UserChronicles.userChronicles;

        if (searched_chronicle.chronicle_id in viewerUC) {
            setInLibrary(true);
        } else {
            setInLibrary(false);
        }
    }, []);

    function toggleChronicle() {
        setToggledChronicle(toggleStatus => !toggleStatus);
    }

    async function addUserChronicle(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log(e.currentTarget[5].innerHTML);
        if (e.currentTarget[5].innerHTML == "Already In Library") {
            toggleChronicle();
            return 
        }

        let chronicleId = searched_chronicle.chronicle_id;
        const formData = new FormData(e.currentTarget);
        const status = formData.get('status');
        const rating = formData.get('rating');
        const review = formData.get('review');
        const episode = formData.get('episode');
        console.log(formData);
        
        const addChronicleToUC = await fetch('http://localhost:5172/user/chronicles/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/text' // Example: Accept JSON responses
            },
            credentials: 'include',
            body: JSON.stringify({
                "chronicleID": chronicleId,
                "status": status,
                "rating": rating,
                "review": review,
                "episode": episode
            })
        });

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
                            <option value="reading">Reading</option>
                            <option value="completed">Completed</option>
                            <option value="paused">Paused</option>
                            <option value="dropped">Dropped</option>
                            <option value="plan to read">Plan to Read</option>
                            <option value="rereading">Rereading</option>
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
import { useState } from "react"
import { SearchedChronicleInfoProps } from "../utils/interfaces";

export default function SearchedChronicle({chronicle} : SearchedChronicleInfoProps) {
    const [toggleStatusSearched, setToggleStatusSearched] = useState(false);

    function toggleSearchedChronicle() {
        setToggleStatusSearched(value => !value);
    }

    function addUserChronicle(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        let chronicleId = chronicle.chronicle_id;
        const formData = new FormData(e.currentTarget);
        const status = formData.get('status');
        const rating = formData.get('rating');
        const review = formData.get('review');
        const episode = formData.get('episode');
        console.log(formData);
        toggleSearchedChronicle();
        // send api call to database to save 
        // unable to update current entries because we don't have a generated UserChroniclesId unless we create one ourselves  
    }

    return(
        <div className="searched-chronicle">
            <p className="searched-chronicle-text">book one</p>
            <p className="searched-chronicle-text">5</p>
            <p className="searched-chronicle-text">348,576</p>
            <p className="searched-chronicle-text">32</p>
            <p className="searched-chronicle-text">Novel</p>
            <p className="searched-chronicle-text">Apr 2024</p>
            <button className='add-chronicle-item-top-button' onClick={toggleSearchedChronicle}>+</button>
            {toggleStatusSearched &&
            <form className="searched-chronicle-add" onSubmit={(e) => addUserChronicle(e)}>
                <div className="searched-chronicle-bottom">
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
                    <button className="add-chronicle-button" onClick={toggleSearchedChronicle}>Cancel</button>
                    <button className="add-chronicle-button" type="submit" value="submit">Submit</button>
                </div>
            </form>
            }
            
        </div>
    )
}
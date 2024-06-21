import { useState } from "react"

/*
To-Do's:
    - rename previous
    - make background when clicking add chronicle darker so you can focus on search chronicles
*/

export default function AddChronicle({searched_chronicle} : SearchedChronicle) {
    const [toggledChronicle, setToggledChronicle] = useState(false);

    function toggleChronicle() {
        setToggledChronicle(toggleStatus => !toggleStatus);
    }

    function addUserChronicle(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        let chronicleId = searched_chronicle.chronicle_id;
        const formData = new FormData(e.currentTarget);
        const status = formData.get('status');
        const rating = formData.get('rating');
        const review = formData.get('review');
        const episode = formData.get('episode');
        console.log(formData);
        toggleChronicle();
        // send api call to database to save 
        // unable to update current entries because we don't have a generated UserChroniclesId unless we create one ourselves  
    }

    return(
        <div className='add-chronicle-item'>
            <p className='add-chronicle-item-top'>{searched_chronicle.title}</p>
            <p className='add-chronicle-item-top'>{searched_chronicle.category}</p>
            <p className='add-chronicle-item-top'>{searched_chronicle.year}</p>
            <button className='add-chronicle-item-top-button' onClick={toggleChronicle}>+</button>
            {toggledChronicle &&
                <form className="add-chronicle-additional" onSubmit={(e) => addUserChronicle(e)}>
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
                        <button className="add-chronicle-button" type="submit" value="submit">Submit</button>
                    </div>
                </form>
            }
        </div>
    )
}
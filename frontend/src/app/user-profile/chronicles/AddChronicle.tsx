import { useState } from "react"

export default function AddChronicle() {
    const [toggledChronicle, setToggledChronicle] = useState(false);

    function toggleChronicle() {
        setToggledChronicle(toggleStatus => !toggleStatus);
    }

    return(
        <div className='add-chronicle-item'>
            <p className='add-chronicle-item-top'>book 1</p>
            <p className='add-chronicle-item-top'>graphic novel</p>
            <p className='add-chronicle-item-top'>2018</p>
            <button className='add-chronicle-item-top-button' onClick={toggleChronicle}>+</button>
            {toggledChronicle &&
                <div className="add-chronicle-additional">
                    <div className="add-chronicle-bottom-first">
                        <p>Status</p>
                        <select>
                            <option value="reading">Reading</option>
                            <option value="completed">Completed</option>
                            <option value="paused">Paused</option>
                            <option value="dropped">Dropped</option>
                            <option value="plan to read">Plan to Read</option>
                            <option value="rereading">Rereading</option>
                        </select>
                        <p>Episode</p>
                        <input type="number"></input>
                        <p>Rating</p>
                        <input type="number"></input>
                    </div>
                    <p className="add-chronicle-item-middle">Review</p>
                    <textarea className="add-chronicle-textarea" placeholder="Write your review here"></textarea>
                    <div className="add-chronicles-item-bottom">
                        <button className="add-chronicle-button">Cancel</button>
                        <button className="add-chronicle-button">Submit</button>
                    </div>
                </div>
            }
        </div>
    )
}
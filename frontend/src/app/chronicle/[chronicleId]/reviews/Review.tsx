import { UserReviews } from "@/app/utils/interfaces"
import { useEffect, useState } from "react"
import { useAppSelector, useAppDispatch } from "@/globalRedux/hooks";
import { updateExistingId, clearChanges } from "@/globalRedux/features/User/UserChroniclesSlice";

// add option that allows users to view the entire review when they click on it

export default function Review({review_data, chronicleID} : {review_data: UserReviews, chronicleID: string}) {
    const dispatch = useAppDispatch();
    let username = useAppSelector(state => state.UserChronicles.username);
    const updateReviewedChronicle = useAppSelector(state => state.UserChronicles.listOfChanges);
    const [reviewHeight, setReviewHeight] = useState("15.3em");

    function expandCollapse() {
        if (reviewHeight == "15.3em") {
            setReviewHeight(currentHeight => "none");
        } else {
            setReviewHeight(currentHeight => "15.3em");
        }
    }

    useEffect(() => {
        const handleUCvisibilityChange = () => {
            sendUCchanges(false);
        };    

        function sendUCchanges(dismount: boolean) {
            console.log(username);
            console.log(review_data.username);
            if (username == review_data.username && (document.visibilityState === "hidden" || dismount) && Object.keys(updateReviewedChronicle).length > 0 && username != "") {
              var url = `http://localhost:5172/user/${username}/chronicles/update`;
              var data = JSON.stringify({
                "listOfChanges": updateReviewedChronicle
              });
              
              console.log("sending changes to db");
              const blob = new Blob([data], { type: 'application/json' });
              navigator.sendBeacon(url, blob);

            }
        }

        document.addEventListener('visibilitychange', handleUCvisibilityChange);

        return() => {            
            sendUCchanges(true);
            document.removeEventListener('visibilitychange', handleUCvisibilityChange);
        }
    }, [review_data.username, updateReviewedChronicle, username]);

    function updateReview(e: React.ChangeEvent<any>) {
        e.target.style.height = 'auto'; // Reset height to auto to calculate new scrollHeight
        e.target.style.height = `${e.target.scrollHeight}px`; // Set height to scrollHeight
        // update user chronicles review
        dispatch(updateExistingId({id: chronicleID, chronicleDetail: "review", changedAttributeValue: e.target.value}));
    }

    return(
        <li className="chronicle-review">
            <div className="chronicle-review-top">
                <h1 className="chronicle-review-username">{review_data.username}</h1>
                <p className="chronicle-review-date">{review_data.review_date}</p>
            </div>
            {username == review_data.username &&
                <textarea className="chronicle-review-text" style={{"maxHeight": reviewHeight}} defaultValue={updateReviewedChronicle[chronicleID] ?? review_data.review} onChange={(e) => updateReview(e)}></textarea>
            }
            {username != review_data.username &&
                <p className="chronicle-review-text" style={{"maxHeight": reviewHeight}}>{review_data.review}</p>
            }
            {reviewHeight == "15.3em" &&
                <button className="chronicle-review-size" onClick={expandCollapse}>Expand</button>
            }
            {reviewHeight == "none" &&
                <button className="chronicle-review-size" onClick={expandCollapse}>Collapse</button>
            }
            <div className="agree-disagree">
                <img className="review-arrow down" src="/images/arrow.svg"/>
                <p className="score">0</p>
                <img className="review-arrow up" src="/images/arrow.svg"/>
            </div>
        </li>
    )
}
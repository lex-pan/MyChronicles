import { ReviewProps } from "@/app/utils/interfaces"
import { useState } from "react"

// add option that allows users to view the entire review when they click on it

export default function Review({review_data} : ReviewProps) {
    const [reviewHeight, setReviewHeight] = useState("15.3em");

    function expandCollapse() {
        if (reviewHeight == "15.3em") {
            setReviewHeight(currentHeight => "none");
        } else {
            setReviewHeight(currentHeight => "15.3em");
        }
    }

    return(
        <li className="chronicle-review">
            <div className="chronicle-review-top">
                <h1 className="chronicle-review-username">username one</h1>
                <p className="chronicle-review-date">April 17, 2024</p>
            </div>
            <p className="chronicle-review-text" style={{"maxHeight": reviewHeight}}> </p>
            {reviewHeight == "15.3em" &&
                <p className="chronicle-review-size" onClick={expandCollapse}>Expand</p>
            }
            {reviewHeight == "none" &&
                <p className="chronicle-review-size" onClick={expandCollapse}>Collapse</p>
            }
            <div className="agree-disagree">
                <img className="review-arrow down" src="/images/arrow.svg"/>
                <p className="score">47</p>
                <img className="review-arrow up" src="/images/arrow.svg"/>
            </div>
        </li>
    )
}
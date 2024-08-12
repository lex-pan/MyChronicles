'use client'
import { UserReviews } from "@/app/utils/interfaces"
import Review from "./Review"
import { useAppSelector } from "@/globalRedux/hooks";
/*Allow user to view their own review here */
// displays user reviews of the chronicle

// What to do here:
/*
user review is displayed at the very front, if the user has no review, then just make it empty
show other reviews that are not the user's (a user can only review a chronicle once, but they have the ability to edit it)
implement a voting system for how accurate a review is
    - user can only vote for or against it once ever
    - create a junction table, table points to userchronicle
        - table includes, voter id, +1 for vote -1 for downvote and the id of the review they voted for (unique composite key)
*/

export default function ChronicleReviews({user_review, reviews, chronicleID} : {user_review: UserReviews, reviews: Array<UserReviews>, chronicleID: string}) {
    let reviewResults : Array<UserReviews> = reviews;
    let username = useAppSelector(state => state.UserChronicles.username);

    return (
        <>
        <ul className="chronicle-reviews">
            <Review key={user_review.username} review_data={user_review} chronicleID ={chronicleID}/>
            {reviewResults.length > 0 && reviewResults.map(item => (
                item.username == username ?  <div key={"none"}></div> :  <Review key={item.username} review_data={item} chronicleID={chronicleID}/>
            ))}
        </ul>
        </>
    )
}
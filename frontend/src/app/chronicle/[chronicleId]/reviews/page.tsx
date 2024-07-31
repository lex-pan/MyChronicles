'use client'
import { UserReview } from "@/app/utils/interfaces"
import Review from "./Review"
/*Allow user to view their own review here */
// displays user reviews of the chronicle
export default function Chronicle() {
    let reviewResults : Array<UserReview> = [
        {
            user_review_id: 347,
            username: "lexus",
            rating: 2.5,
            review: `Rating: 2.5/5 Interesting premise with shoddy execution & excessive reaction scenes to MC's every move. This novel can be quite funny, you just need to ignore the massive plot holes (his origins which can be easily investigated if the side characters have a real functioning brain). &#13;&#10;I really like the filming/acting scenes but good lord it can get real tedious quickly with the excessive simping over MC's 'monstrous' & never been seen before acting skills. It's like those sports animes with the reactions/commentary on the characters' every action in their games. The perspective is all over the place as the author just shoves every character's reaction/thoughts as much as they can.
        Example:
        MC: *acting*
        Director: 'He can do that without being fazed by the crowd? Amazing, this monster (MC) is just amazing!
        Actress: 'He improved, he got even better!'
        Cameraman: 'His presence is overwhelming, I can't believe he's just a rookie actor!'

        Manager: 'He can act like this by only just reading the script for 5 minutes! What a monster!'

        And many many more characters and their dogs : 'Blah blah blah, *just doling out praises*

        This kind of scenario happens a lot in the novel. There's also no tension and set backs for the MC at all in this novel. The system just gives him everything he needs. Heck, it even improved his singing abilities. The MC even said at one time (when a supposed problem occurs) that everything would always go right in the end.

        This novel can be a fun read, if you can handle the excessive simping over the MC and the plot holes.`
        },
        {
            user_review_id: 468,
            username: "lexus",
            rating: 2.5,
            review: `Rating: 2.5/5 Interesting premise with shoddy execution & excessive reaction scenes to MC's every move. This novel can be quite funny, you just need to ignore the massive plot holes (his origins which can be easily investigated if the side characters have a real functioning brain). &#13;&#10;I really like the filming/acting scenes but good lord it can get real tedious quickly with the excessive simping over MC's 'monstrous' & never been seen before acting skills. It's like those sports animes with the reactions/commentary on the characters' every action in their games. The perspective is all over the place as the author just shoves every character's reaction/thoughts as much as they can.
        Example:
        MC: *acting*
        Director: 'He can do that without being fazed by the crowd? Amazing, this monster (MC) is just amazing!
        Actress: 'He improved, he got even better!'
        Cameraman: 'His presence is overwhelming, I can't believe he's just a rookie actor!'

        Manager: 'He can act like this by only just reading the script for 5 minutes! What a monster!'

        And many many more characters and their dogs : 'Blah blah blah, *just doling out praises*

        This kind of scenario happens a lot in the novel. There's also no tension and set backs for the MC at all in this novel. The system just gives him everything he needs. Heck, it even improved his singing abilities. The MC even said at one time (when a supposed problem occurs) that everything would always go right in the end.

        This novel can be a fun read, if you can handle the excessive simping over the MC and the plot holes.`
        },
        {
            user_review_id: 190,
            username: "lexus",
            rating: 2.5,
            review: `Rating: 2.5/5 Interesting premise with shoddy execution & excessive reaction scenes to MC's every move. This novel can be quite funny, you just need to ignore the massive plot holes (his origins which can be easily investigated if the side characters have a real functioning brain). &#13;&#10;I really like the filming/acting scenes but good lord it can get real tedious quickly with the excessive simping over MC's 'monstrous' & never been seen before acting skills. It's like those sports animes with the reactions/commentary on the characters' every action in their games. The perspective is all over the place as the author just shoves every character's reaction/thoughts as much as they can.
        Example:
        MC: *acting*
        Director: 'He can do that without being fazed by the crowd? Amazing, this monster (MC) is just amazing!
        Actress: 'He improved, he got even better!'
        Cameraman: 'His presence is overwhelming, I can't believe he's just a rookie actor!'

        Manager: 'He can act like this by only just reading the script for 5 minutes! What a monster!'

        And many many more characters and their dogs : 'Blah blah blah, *just doling out praises*

        This kind of scenario happens a lot in the novel. There's also no tension and set backs for the MC at all in this novel. The system just gives him everything he needs. Heck, it even improved his singing abilities. The MC even said at one time (when a supposed problem occurs) that everything would always go right in the end.

        This novel can be a fun read, if you can handle the excessive simping over the MC and the plot holes.`
        }
    ]  

    return (
        <ul className="chronicle-reviews">
            {reviewResults.map(item => (
                <Review key={item.user_review_id} review_data={item}/>
            ))}
        </ul>
    )
}
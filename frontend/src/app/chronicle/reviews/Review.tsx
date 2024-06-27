import { ReviewProps } from "@/app/utils/interfaces"

// add option that allows users to view the entire review when they click on it

export default function Review({review_data} : ReviewProps) {
    return(
        <li className="chronicle-review">
            <h1 className="chronicle-review-username">username one</h1>
            <p className="chronicle-review-date">April 17, 2024</p>
            <p className="chronicle-review-text"> Rating: 2.5/5 Interesting premise with shoddy execution & excessive reaction scenes to MC's every move. This novel can be quite funny, you just need to ignore the massive plot holes (his origins which can be easily investigated if the side characters have a real functioning brain). &#13;&#10;I really like the filming/acting scenes but good lord it can get real tedious quickly with the excessive simping over MC's 'monstrous' & never been seen before acting skills. It's like those sports animes with the reactions/commentary on the characters' every action in their games. The perspective is all over the place as the author just shoves every character's reaction/thoughts as much as they can.
        Example:
        MC: *acting*
        Director: 'He can do that without being fazed by the crowd? Amazing, this monster (MC) is just amazing!
        Actress: 'He improved, he got even better!'
        Cameraman: 'His presence is overwhelming, I can't believe he's just a rookie actor!'

        Manager: 'He can act like this by only just reading the script for 5 minutes! What a monster!'

        And many many more characters and their dogs : 'Blah blah blah, *just doling out praises*

        This kind of scenario happens a lot in the novel. There's also no tension and set backs for the MC at all in this novel. The system just gives him everything he needs. Heck, it even improved his singing abilities. The MC even said at one time (when a supposed problem occurs) that everything would always go right in the end.

        This novel can be a fun read, if you can handle the excessive simping over the MC and the plot holes.
            </p>
            <div className="agree-disagree">
                <p className="arrow">⇧</p>
                <p className="score">47</p>
                <p className="arrow">⇩</p>
            </div>
        </li>
    )
}
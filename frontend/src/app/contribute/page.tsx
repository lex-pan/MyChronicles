// adding chronicles should be allowed on the website
// new wesite requests and bugs should be in discord
// no link for donating, no1 likes donating ripp
'use client'
import { useAppSelector } from "@/globalRedux/hooks"

export default function Contribute() {
    const loggedIn = useAppSelector(state => state.UserChronicles.loggedIn);

    // length as in total time of series
    return(
        <div className="contribute">
            {loggedIn &&
            <>
            <h1 className="add-searched-chronicle-title">Add New Chronicle To Database</h1>
            <div className="contribute-adding-chronicles">
                <p>Title</p>
                <input placeholder="Required field"></input>
                <p>Author</p>
                <input></input>
                <p>Category</p>
                <select>
                    <option value="Novel">Novel</option>
                    <option value="Graphic Novel">Graphic Novel</option>
                    <option value="Film">Film</option>
                    <option value="Show">Show</option>
                </select>
                <p>Episodes</p>
                <input></input>
                <p>Length</p>
                <input></input>
                <p>Language</p>
                <input></input>
                <p>Country</p>
                <input></input>
                <p>Status</p>
                <select name="showStatus" id="showStatus">
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Paused">Paused</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Hiatus">Hiatus</option>
                    <option value="In Development">In Development</option>
                    <option value="Pilot">Pilot</option>
                </select>
                <p>Start Date</p>
                <input type="date"></input>
                <p>End Date</p>
                <input type="date"></input>
                <p>Synopsis</p>
                <input></input>
            </div>
            <h1 className="add-searched-chronicle-title cursor">Submit</h1>
            </>
            }
            {!loggedIn &&
            <p>Login to add new Chronicles</p>
            }
            <a href="https://discord.gg/j48t82Tduk">Join MyChronicles discord for site requests, bug fixes, or to hang out</a>
        </div>
    )
}
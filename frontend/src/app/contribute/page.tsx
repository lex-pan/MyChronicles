// adding chronicles should be allowed on the website
// new wesite requests and bugs should be in discord
// no link for donating, no1 likes donating ripp
'use client'
import { useAppSelector } from "@/globalRedux/hooks"
import SelectCountry from "../utils/Components/SelectCountry";
import { autoScalingTextArea } from "../utils/convenientFunctions";
import apiLink from '@/app/utils/apiLink';

export default function Contribute() {
    const loggedIn = useAppSelector(state => state.UserChronicles.loggedIn);

    async function addNewChronicle(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const title = formData.get('title');
        const author = formData.get('author');
        const category = formData.get('category');
        const episodes = formData.get('episodes');
        const length = formData.get('length');
        const country = formData.get('country');
        const status = formData.get('showStatus');
        const start_date = formData.get('start_date');
        const end_date = formData.get('end_date');
        const synopsis = formData.get('synopsis');

        if (episodes && isNaN(parseFloat(episodes.toString())) && episodes.toString() != "") {
            return 
        }

        console.log(formData);

        const addNewChronicleToDB = await fetch(`${apiLink}/chronicles/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/text' // Example: Accept JSON responses
            },
            credentials: 'include',
            body: JSON.stringify({
                'title': title,
                'author': author,
                'category': category,
                'episodes': episodes,
                'length': length,
                'country': country,
                'status': status,
                'start_date': start_date,
                'end_date': end_date,
                'synopsis': synopsis
            })
        });

        console.log(addNewChronicleToDB.json());
    }

    function validateInput(e: React.ChangeEvent<any>) {
        let inputValue = e.target.value;
        console.log(inputValue);
        
        if (inputValue[inputValue.length-1] == "." || inputValue == "") {
            return 
        }

        if (isNaN(parseFloat(inputValue))) {
            e.target.value = "";
            return 
        } else {
            e.target.value = Math.round(parseFloat(inputValue) * 10)/10;
        }
    }


    // length as in total time of series
    return(
        <div className="contribute">
            {loggedIn &&
            <>
            <h1 className="add-searched-chronicle-title">Add New Chronicle To Database</h1>
            <form className="contribute-adding-chronicles" onSubmit={addNewChronicle}>
                <p>Title</p>
                <input className="contribute-adding-chronicles-input" placeholder="Required field" name="title" required></input>
                <p>Author</p>
                <input className="contribute-adding-chronicles-input" name="author"></input>
                <p>Category</p>
                <select className="contribute-adding-chronicles-select" name="category">
                    <option value="Novel">Novel</option>
                    <option value="Graphic Novel">Graphic Novel</option>
                    <option value="Film">Film</option>
                    <option value="Show">Show</option>
                </select>
                <p>Episodes</p>
                <input className="contribute-adding-chronicles-input" name="episodes" placeholder="Up to one decimal point" onChange={(e) => validateInput(e)}></input>
                <p>Length</p>
                <input className="contribute-adding-chronicles-input" name="length" placeholder="Length per episode ex: 1h30m"></input>
                <p>Country</p>
                <SelectCountry cssStyling="contribute-adding-chronicles-input" defaultValue=""/>
                <p>Status</p>
                <select className="contribute-adding-chronicles-select" name="showStatus">
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Paused">Paused</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Hiatus">Hiatus</option>
                    <option value="In Development">In Development</option>
                    <option value="Pilot">Pilot</option>
                </select>
                <p>Start Date</p>
                <input type="date" className="contribute-adding-chronicles-input" name="start_date"></input>
                <p>End Date</p>
                <input type="date" className="contribute-adding-chronicles-input" name="end_date"></input>
                <p>Synopsis</p>
                <textarea onChange={autoScalingTextArea} name="synopsis" className="contribute-adding-chronicles-input" placeholder="Required field" required></textarea>
                <button className="add-searched-chronicle-title add-searched-chronicle-submit" type="submit">Submit</button>
            </form>
            </>
            }
            {!loggedIn &&
            <p>Login to add new Chronicles</p>
            }
            <a href="https://discord.gg/j48t82Tduk">Join MyChronicles discord for site requests, bug fixes, or to hang out</a>
        </div>
    )
}
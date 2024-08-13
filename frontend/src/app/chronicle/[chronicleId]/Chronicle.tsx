// main page 
// displays title, synopsis, stats, character

'use client'
import AddChronicleOverlay from "@/app/utils/Components/AddChronicleOverlay";
import React, { useRef, useState } from "react";
import { GeneralSearchedChronicleInfo, allChronicleInfo, allChronicleInfoProps, tagsAndGenres } from "@/app/utils/interfaces";
import { useAppSelector, useAppDispatch } from "@/globalRedux/hooks";
import Link from "next/link";
import SelectCountry from "@/app/utils/Components/SelectCountry";
import tagsAndGenre from "@/app/utils/tagsAndGenre"
import { Dispatch, SetStateAction } from 'react';
import convertDatetoReadble from "@/app/utils/convenientFunctions";
import { updateChronicle } from "@/globalRedux/features/Chronicles/ChronicleUpdateSlice";
import { useRouter } from "next/navigation";

export default function Chronicle({allInfo}: allChronicleInfoProps) {
    // permissions and toggling
    const dispatch = useAppDispatch();
    const loggedIn = useAppSelector(state => state.UserChronicles.loggedIn);
    const chroniclePostUpdate : allChronicleInfo = useAppSelector(state => state.ChronicleUpdates.changed_chronicles[allInfo.chronicle_id]);
    const [editAllowed, setEditAllowed] = useState(false);
    const [toggleAddChronicles, setToggleAddChronicles] = useState(false);
    const router = useRouter();

    const chronicleInfo = useRef<tagsAndGenres>({tags: tagsAndGenre.tags, genres: tagsAndGenre.genres});
    
    const [searchedGenres, setSearchedGenres] = useState(tagsAndGenre.genres);
    const [searchedTags, setSearchedTags] = useState(tagsAndGenre.tags);
    const [currentGenre, setCurrentGenre] = useState<string[]>(allInfo.genres ?? []);
    const [currentTags, setCurrentTags] = useState<string[]>(allInfo.tags ?? []);
    const [currentOtherCreators, setCurrentOtherCreators] =  useState<string[]>([]);
    const [currentAlternativeTitles, setCurrentAlternativeTitles] = useState<string[]>(allInfo.alternative_titles ?? []);

    const chronicleToBeAdded = useRef<GeneralSearchedChronicleInfo>({
        chronicle_id: allInfo.chronicle_id,
        chronicle_title: allInfo.chronicle_title,
        country: allInfo.country,
        creator: allInfo.creator,
        rating: allInfo.rating,
        members: allInfo.members,
        entertainment_category: allInfo.entertainment_category,
        episodes: allInfo.episodes,
        status: allInfo.status,
        synopsis: allInfo.synopsis
    });

    function toggleAdd() {
        setToggleAddChronicles(value => !value);
    }

    function toggleEdit() {
        setEditAllowed(edit => !edit);  
    }

    function filterAttributes(e: React.ChangeEvent<any>, attributesToLoopThrough: string[], setUseState: Dispatch<SetStateAction<string[]>>) {
        let input = e.target.value;
        let genreOrTagMeetingInput : string[] = [];
        for (let i = 0; i < attributesToLoopThrough.length; i++) {
            let genreOrTag = attributesToLoopThrough[i].toLowerCase();
            if (genreOrTag.includes(input)) {
                genreOrTagMeetingInput.push(attributesToLoopThrough[i]);
            }
        }

        setUseState(prevGenre => genreOrTagMeetingInput);
    }

    function addAttributeOnEnter(e: React.KeyboardEvent<HTMLInputElement>, addTo: Dispatch<SetStateAction<string[]>>, removeFrom: Dispatch<SetStateAction<string[]>>, type: string) {
        if (e.key === 'Enter') {
            if (type == "genre" && searchedGenres.length > 0) {
                chronicleInfo.current.genres = chronicleInfo.current.genres.filter(genre => genre !== searchedGenres[0]);
                removeFrom(availableGenres => availableGenres.filter(genre => genre !== searchedGenres[0]));
                addTo(prevGenres => [...prevGenres, searchedGenres[0]]);
            }
            
            if (type == "tag" && searchedTags.length > 0){
                chronicleInfo.current.tags = chronicleInfo.current.tags.filter(tag => tag !== searchedTags[0]);
                removeFrom(availableTags => availableTags.filter(tags => tags !== searchedTags[0]));
                addTo(prevTags => [...prevTags, searchedTags[0]]);
            }
        }
    }

    function addNonExistingAttributeOnEnter(e: React.KeyboardEvent<HTMLInputElement>, addTo: Dispatch<SetStateAction<string[]>>) {
        if (e.key === 'Enter') {
            const input = e.currentTarget.value;
            e.currentTarget.value = "";
            addTo(prevItems => [...prevItems, input]);
        }
    }

    function removeNonExistingAttribute(index: number, removeFrom: Dispatch<SetStateAction<string[]>>) {
        removeFrom(prevItems => prevItems.filter((_, i) => i !== index));
    }

    function addAttributeOnclick(attribute: string, addTo: Dispatch<SetStateAction<string[]>>, removeFrom: Dispatch<SetStateAction<string[]>>, type: string) {
        addTo(prevItems => [...prevItems, attribute]);
        removeFrom(availableItems => availableItems.filter(item => item !== attribute));

        if (type == "genre") {
            chronicleInfo.current.genres = chronicleInfo.current.genres.filter(genre => genre !== attribute);
        } else {
            chronicleInfo.current.tags = chronicleInfo.current.tags.filter(tag => tag !== attribute);
        }
    }

    function removeAttribute(attribute: string, index: number, removeFrom: Dispatch<SetStateAction<string[]>>, addBack: Dispatch<SetStateAction<string[]>>, type: string) {
        removeFrom(prevItems => prevItems.filter((_, i) => i !== index));   
        addBack(prevItems => [...prevItems, attribute]);

        if (type == "genre") {
            chronicleInfo.current.genres.push(attribute);
        } else {
            chronicleInfo.current.tags.push(attribute);
        }
    }

    async function submitEdit(e: React.FormEvent<HTMLFormElement>) {
        console.log("submitting");
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        let converted_episode = formData.get('episodes')?.toString();
        let episodeNumber;
        console.log(converted_episode);
        if (converted_episode != "" && converted_episode != undefined) {
            episodeNumber = parseFloat(converted_episode);

            if (!isNaN(episodeNumber)) {
                // Round to one decimal place
                let roundedEpisode = Math.round(episodeNumber * 10) / 10;
                console.log(roundedEpisode);
            } else {
                return "invalid float";
            }
        }
        console.log("passed episode check");

        const updateChronicleResponse = await fetch('http://localhost:5172/chronicles/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/text' // Example: Accept JSON responses
            },
            credentials: 'include',
            body: JSON.stringify({
                "chronicle_id": allInfo.chronicle_id,
                "status": formData.get('showStatus')?.toString(),
                "country": formData.get('country')?.toString(),
                "author": formData.get('author')?.toString(),
                "episodes": episodeNumber,
                "synopsis": formData.get('synopsis')?.toString(),
                "length": formData.get('length')?.toString(),
                "start_date": formData.get("start date")?.toString(),
                "end_date": formData.get("end date")?.toString(),
                "genres": currentGenre,
                "tags": currentTags,
                "other_creators": currentOtherCreators,
                "alt_titles": currentAlternativeTitles,
            })
        });

        let userUpdatedChronicle : allChronicleInfo = {
            chronicle_id: allInfo.chronicle_id,
            chronicle_title: allInfo.chronicle_title,
            rating: allInfo.rating,
            members: allInfo.members,
            entertainment_category: allInfo.entertainment_category,
            status: formData.get('showStatus')?.toString() || "",
            country: formData.get('country')?.toString() || "",
            creator: formData.get('author')?.toString() || "",
            episodes: episodeNumber || 0,
            synopsis: formData.get('synopsis')?.toString() || "",
            length: formData.get('length')?.toString() || "",
            start_date: formData.get("start date")?.toString() || "",
            end_date: formData.get("end date")?.toString() || "",
            genres: currentGenre,
            tags: currentTags,
            other_creators: currentOtherCreators,
            alternative_titles: currentAlternativeTitles,
        }

        dispatch(updateChronicle(userUpdatedChronicle));

        toggleEdit();
    }

    function preventSubmit(e: React.KeyboardEvent<HTMLFormElement>) {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    }

    function goBack() {
        router.back();
    }

    return (
        <>
        {toggleAddChronicles && chronicleToBeAdded.current &&
            <AddChronicleOverlay chronicle={chronicleToBeAdded.current} toggle={toggleAdd}/>
        }
        {editAllowed &&
        <form className="chronicle-page" onKeyDown={(e) => preventSubmit(e)} onSubmit={submitEdit}>
            <h1>{allInfo.chronicle_title}</h1>
            <div className="stats-general">
                <p className="chronicle-attributes chronicle-first-column chronicle-first-row">Members: {allInfo.members}</p>
                <p className="chronicle-attributes chronicle-first-column">Rating: {allInfo.rating}</p>
                <p className="chronicle-attributes chronicle-first-column">Category: {allInfo.entertainment_category}</p>
                <p className="chronicle-attributes chronicle-first-column">Status: 
                    <select name="showStatus" defaultValue={allInfo.status ?? ""}>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                        <option value="Paused">Paused</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Hiatus">Hiatus</option>
                        <option value="In Development">In Development</option>
                        <option value="Pilot">Pilot</option>
                        <option value="">-</option>
                    </select>
                </p>
                <p className="chronicle-attributes chronicle-first-column">Country: 
                    <SelectCountry cssStyling={""} defaultValue={allInfo.country}/>
                </p>
                <label className="chronicle-attributes chronicle-first-column">Author: <input name="author" defaultValue={allInfo.creator}></input></label>
                <label className="chronicle-attributes chronicle-first-column">Episodes: <input name="episodes" defaultValue={allInfo.episodes}></input></label>
            </div>
            <textarea name="synopsis" className="synopsis" defaultValue={allInfo.synopsis}></textarea>
            <div className="stats-detailed">
                <div className="stats-detailed-minor">
                    <p>Length: <input className="minor-text-input" name="length" defaultValue={allInfo.length}></input></p>
                    <p>Start Date: <input type="date" name="start date" defaultValue={convertDatetoReadble(allInfo.start_date)}></input></p>
                    <p>End Date: <input type="date" name="end date" defaultValue={convertDatetoReadble(allInfo.end_date)}></input></p>
                </div>
                <div>Genre
                <input onChange={(e) => filterAttributes(e, chronicleInfo.current.genres, setSearchedGenres)} onKeyDown={(e) => addAttributeOnEnter(e, setCurrentGenre, setSearchedGenres, "genre")}></input>
                <ul className="search-chronicle-attributes">
                    {searchedGenres.length > 0 && searchedGenres.map((genre, index) =>
                            <li onClick={() => addAttributeOnclick(genre, setCurrentGenre, setSearchedGenres, "genre")} key={index} className={index == 0 ? "selected-edit" : ""}>{genre}</li>
                    )}
                </ul>
                </div>
                <ul className="chronicle-attribute-list">
                    {currentGenre.length > 0 && currentGenre.map((genre, index) =>
                            <li onClick={() => removeAttribute(genre, index, setCurrentGenre, setSearchedGenres, "genre")} className="remove-attribute" key={index}>{genre}</li>
                    )}
                </ul>
                <div>Tags
                <input onChange={(e) => filterAttributes(e, chronicleInfo.current.tags, setSearchedTags)} onKeyDown={(e) => addAttributeOnEnter(e, setCurrentTags, setSearchedTags, "tag")}></input>
                <ul className="search-chronicle-attributes">
                    {searchedTags.length > 0 && searchedTags.map((genre, index) =>
                            <li onClick={() => addAttributeOnclick(genre, setCurrentTags, setSearchedTags, "tag")} key={index} className={index == 0 ? "selected-edit" : ""}>{genre}</li>
                    )}
                </ul>
                </div>
                <ul className="chronicle-attribute-list">
                    {currentTags.length > 0 && currentTags.map((tag, index) =>
                            <li onClick={(e) => removeAttribute(tag, index, setCurrentTags, setSearchedTags, "tag")} key={index}>{tag}</li>
                    )}
                </ul>
                <div>Other Creators
                <input onKeyDown={(e) => addNonExistingAttributeOnEnter(e, setCurrentOtherCreators)}></input>
                <ul className="chronicle-attribute-list">
                    {currentOtherCreators.length > 0 && currentOtherCreators.map((alt_title, index) =>
                            <li onClick={() => removeNonExistingAttribute(index, setCurrentOtherCreators)} key={index}>{alt_title}</li>
                    )}
                </ul>
                </div>
                <p>Alternative Titles
                <input onKeyDown={(e) => addNonExistingAttributeOnEnter(e, setCurrentAlternativeTitles)}></input>
                </p>
                <ul className="chronicle-attribute-list">
                    {currentAlternativeTitles.length > 0 && currentAlternativeTitles.map((alt_title, index) =>
                            <li onClick={() => removeNonExistingAttribute(index, setCurrentAlternativeTitles)} key={index}>{alt_title}</li>
                    )}
                </ul>
            </div>
            <div className="chronicle-page-bottom">
                <button onClick={goBack} type="button">Back</button>
                {loggedIn &&
                <>
                <button type="button" onClick={toggleEdit}>Cancel</button>       
                <button type="submit">Submit</button>         
                </>                
                }
                {!loggedIn &&
                <Link href={"/login"}><button>Login to Edit</button></Link>
                }
                <button onClick={toggleAdd} type="button">Add</button>
            </div>
        </form> 
        }
        {!editAllowed &&
        <div className="chronicle-page">
            <h1>{allInfo.chronicle_title}</h1>
            <div className="stats-general">
                <p className="chronicle-attributes chronicle-first-column chronicle-first-row">Members: {allInfo.members}</p>
                <p className="chronicle-attributes chronicle-first-column">Rating: {allInfo.rating}</p>
                <p className="chronicle-attributes chronicle-first-column">Category: {allInfo.entertainment_category}</p>
                <p className="chronicle-attributes chronicle-first-column">Status: {allInfo.status}</p>
                <p className="chronicle-attributes chronicle-first-column">Country: {allInfo.country}</p>
                <p className="chronicle-attributes chronicle-first-column">Author: {allInfo.creator}</p>
                <p className="chronicle-attributes chronicle-first-column">Episodes: {allInfo.episodes}</p>
            </div>
            <textarea disabled className="synopsis" value={allInfo.synopsis}></textarea>
            <div className="stats-detailed">
                <div className="stats-detailed-minor">
                    <p>Length: {chroniclePostUpdate ? chroniclePostUpdate.length : allInfo.length}</p>
                    <p>Start Date: {chroniclePostUpdate ? convertDatetoReadble(chroniclePostUpdate.start_date) : convertDatetoReadble(allInfo.start_date)}</p>
                    <p>End Date: {chroniclePostUpdate ? convertDatetoReadble(chroniclePostUpdate.end_date) : convertDatetoReadble(allInfo.end_date)}</p>
                </div>
                <div>Genre</div>
                <ul className="chronicle-attribute-list">
                    {chroniclePostUpdate && chroniclePostUpdate.genres.length > 0 && chroniclePostUpdate.genres.map((genre, index) =>
                        <li key={index}>{genre}</li>
                    )}
                    {!chroniclePostUpdate && currentGenre.length > 0 && currentGenre.map((genre, index) =>
                            <li key={index}>{genre}</li>
                    )}
                </ul>
                <div>Tags</div>
                <ul className="chronicle-attribute-list">
                    {chroniclePostUpdate && chroniclePostUpdate.tags.length > 0 && chroniclePostUpdate.tags.map((tag, index) =>
                        <li key={index}>{tag}</li>
                    )}
                    {!chroniclePostUpdate && allInfo.tags && allInfo.tags.length > 0 && allInfo.tags.map((tag, index) =>
                            <li key={index}>{tag}</li>
                    )}
                </ul>
                <p>Other Creators</p>
                <ul className="chronicle-attribute-list">
                {chroniclePostUpdate && chroniclePostUpdate.other_creators.length > 0 && chroniclePostUpdate.other_creators.map((creator, index) =>
                        <li key={index}>{creator}</li>
                )}
                {!chroniclePostUpdate && allInfo.creator && allInfo.creator.length > 0 && allInfo.alternative_titles.map((creator, index) =>
                            <li key={index}>{creator}</li>
                )}
                </ul>
                <p>Alternative Titles</p>
                <ul className="chronicle-attribute-list">
                    {chroniclePostUpdate && chroniclePostUpdate.alternative_titles.length > 0 && chroniclePostUpdate.alternative_titles.map((alt_title, index) =>
                        <li key={index}>{alt_title}</li>
                    )}
                    {allInfo.alternative_titles.length > 0 && allInfo.alternative_titles.map((alt_title, index) =>
                            <li key={index}>{alt_title}</li>
                    )}
                </ul>
            </div>
            <div className="chronicle-page-bottom">
                <button onClick={goBack} type="button">Back</button>
                {loggedIn &&
                <button onClick={toggleEdit}>Edit</button>                
                }
                {!loggedIn &&
                <Link href={"/login"}><button>Login to Edit</button></Link>
                }
                <button onClick={toggleAdd}>Add</button>
            </div>
        </div> 
        }
    </>
    )
}
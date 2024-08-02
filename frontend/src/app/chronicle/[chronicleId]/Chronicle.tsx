// main page 
// displays title, synopsis, stats, character
'use client'
import AddChronicleOverlay from "@/app/utils/Components/AddChronicleOverlay";
import { useRef, useState } from "react";
import { GeneralSearchedChronicleInfo } from "@/app/utils/interfaces";

interface allChronicleInfo{
    chronicle_id: string;
    chronicle_title: string;
    country: string;
    creator: string;
    rating: number;
    members: number;
    entertainment_category: string;
    episodes: number;
    status: string;
    synopsis: string;
    genres: [],
    tags: [],
    alternative_titles: []
};

interface allChronicleInfoProps{
    allInfo: allChronicleInfo
};

export default function Chronicle({allInfo}: allChronicleInfoProps) {
    const [toggleAddChronicles, setToggleAddChronicles] = useState(false);
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

    function toggle(chronicleToAdd: GeneralSearchedChronicleInfo | null) {
        setToggleAddChronicles(value => !value);
        console.log(toggleAddChronicles);
        console.log(chronicleToBeAdded);
    }

    return (
        <>
        {toggleAddChronicles && chronicleToBeAdded.current &&
            <AddChronicleOverlay chronicle={chronicleToBeAdded.current} toggle={toggle}/>
        }
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
            <p className="synopsis">{allInfo.synopsis}</p>
            <div className="stats-detailed">
                <p>Genre</p>
                <ul className="chronicle-attribute-list">
                    {allInfo.genres.length > 0 && allInfo.genres.map((genre, index) =>
                            <li key={index}>{genre}</li>
                    )}
                </ul>
                <p>Tags</p>
                <ul className="chronicle-attribute-list">
                    {allInfo.tags.length > 0 && allInfo.tags.map((tag, index) =>
                            <li key={index}>{tag}</li>
                    )}
                </ul>
                <p>Creators</p>
                <p>Alternative Titles</p>
                <ul className="chronicle-attribute-list">
                    {allInfo.alternative_titles.length > 0 && allInfo.alternative_titles.map((alt_title, index) =>
                            <li key={index}>{alt_title}</li>
                    )}
                </ul>
            </div>
            <div className="chronicle-page-bottom">
                <button onClick={() => toggle(chronicleToBeAdded.current)}>Add</button>
            </div>
        </div>
    </>
    )
}
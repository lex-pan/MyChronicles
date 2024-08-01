import { DetailedSearchChronicleInfoProps } from "../utils/interfaces";
import Link from "next/link";

export default function SearchedChronicle({chronicle, toggleAdd} : DetailedSearchChronicleInfoProps) {
    return(
        <div className="search-container">
            <Link href={`/chronicle/${chronicle.chronicle_id}`} className="search-container-title"><h1>{chronicle.chronicle_title ?? "N/A"}</h1></Link>
            <div className="search-container-stats-container">
                <p className="search-container-stat">Category: {chronicle.entertainment_category ?? "N/A"}</p>
                <p className="search-container-stat">Rating: {chronicle.rating ?? "N/A"}</p>
                <p className="search-container-stat">Members: {chronicle.members ?? "N/A"}</p>
                <p className="search-container-stat">Episodes: {chronicle.episodes ?? "N/A"}</p>
                <p className="search-container-stat">Status: {chronicle.status ?? "N/A"}</p>
                <p className="search-container-stat">Author: {chronicle.creator ?? "N/A"}</p>
                <p className="search-container-stat">Country: {chronicle.country ?? "N/A"}</p>
            </div>
            <textarea className="search-container-synopsis" defaultValue={chronicle.synopsis ?? "N/A"} disabled/>
            <div className="search-container-bottom">
                <div className="grid-info-stars-outer"><div className="grid-info-stars-inner"></div></div>
                <button className="search-container-add" onClick={() => toggleAdd(chronicle)}>Add</button>
            </div>
        </div>
    )
}
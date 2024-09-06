import { importedChronicle } from "@/app/utils/interfaces";
import { useState } from "react";
import apiLink from "@/app/utils/apiLink";
import toast from "react-hot-toast";

export default function ImportChronicles({toggleImportChronicles} : {toggleImportChronicles : () => void}) {
    const [chroniclesToImport, setChroniclesToImport] = useState<Array<importedChronicle>>([]);

    function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        let filteredImportedChronicles : Array<importedChronicle> = [];
        if (e.target.files != null) {
            let file = e.target.files[0];
            const reader = new FileReader();

            // This will be called when the reading operation is complete
            reader.onload = (event) => {
                if (event.target && event.target.result) {
                    // contents of the file
                    const fileContent = event.target.result as string;
                    // Parse the XML content
                    // The parser essentially converts XML into DOM, and then you can get element by tag name
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(fileContent, "application/xml");

                    // check if entry comes from myanimelist
                    // if not, then we want to add one from anilist json to xml conversion

                    let MALorigin = xmlDoc.getElementsByTagName("myanimelist")[0];
                    let AnilistJsonToXML = xmlDoc.getElementsByTagName("MediaListCollection")[0];
                    console.log(AnilistJsonToXML);
                    if (MALorigin != undefined) {
                        // check if it's anime or manga
                        let chroniclesType = "anime";
                        let chronicles = xmlDoc.getElementsByTagName("user_total_anime")[0];

                        if (chronicles == undefined) {
                            chronicles = xmlDoc.getElementsByTagName("user_total_manga")[0];
                            chroniclesType = "manga";
                        }

                        // Get all <anime> elements
                        const chronicleElements = xmlDoc.getElementsByTagName(chroniclesType);

                        // Loop through each <anime> or <manga> element
                        for (let i = 0; i < chronicleElements.length; i++) {
                            const chronicle = chronicleElements[i];

                            let title;
                            let entertainment_category;
                            let num_of_episodes;
                            let user_watched_or_read;

                            if (chroniclesType == "anime") {
                                title = chronicle.getElementsByTagName("series_title")[0].textContent;
                                entertainment_category = chronicle.getElementsByTagName("series_type")[0].textContent;
                                num_of_episodes = chronicle.getElementsByTagName("series_episodes")[0].textContent;
                                user_watched_or_read = chronicle.getElementsByTagName("my_watched_episodes")[0].textContent;
                            } else {
                                title = chronicle.getElementsByTagName("manga_title")[0].textContent;
                                entertainment_category = "Graphic Novel";
                                num_of_episodes = chronicle.getElementsByTagName("manga_chapters")[0].textContent;
                                user_watched_or_read = chronicle.getElementsByTagName("my_read_chapters")[0].textContent;
                            }

                            const user_start_date = chronicle.getElementsByTagName("my_start_date")[0].textContent;
                            const user_finish_date = chronicle.getElementsByTagName("my_finish_date")[0].textContent;
                            const user_rating = chronicle.getElementsByTagName("my_score")[0].textContent;
                            const user_status = chronicle.getElementsByTagName("my_status")[0].textContent;
                            const user_comments = chronicle.getElementsByTagName("my_comments")[0].textContent;

                            if (title == ("" || undefined || null) || entertainment_category == ("" || undefined || null)) {
                                continue;
                            }

                            if (num_of_episodes == "") {
                                num_of_episodes = null;
                            }

                            const imported_chronicle : importedChronicle = {
                                title: title,
                                category: entertainment_category,
                                num_episodes: num_of_episodes,
                                episodes_watched: user_watched_or_read,
                                user_rating: user_rating,
                                user_start_date: user_start_date,
                                user_last_watched: user_finish_date,
                                user_status: user_status,
                                comments: user_comments
                            }

                            let cleaned_chronicle : importedChronicle = chronicleDataMapping(imported_chronicle);
                            filteredImportedChronicles.push(cleaned_chronicle);
                        }
                    }

                    if (AnilistJsonToXML != undefined) {
                        // check if it's anime or manga
                        let category = xmlDoc.getElementsByTagName("siteUrl")[0].textContent;
                        if (category?.includes("manga")) {
                            category = "Graphic Novel";
                        } else {
                            category = "Anime"
                        }

                        // Get all entries
                        const chronicleElements = xmlDoc.getElementsByTagName("entries");
                        
                        for (let i = 0; i < chronicleElements.length; i++) {
                            const chronicle = chronicleElements[i];

                            let title;
                            let entertainment_category;
                            let num_of_episodes;
                            let user_watched_or_read;

                            if (category == "Anime") {
                                continue;
                            } else {
                                title = chronicle.getElementsByTagName("english")[0].textContent;
                                entertainment_category = "Graphic Novel";
                                num_of_episodes = chronicle.getElementsByTagName("chapters")[0].textContent;
                                user_watched_or_read = chronicle.getElementsByTagName("progress")[0].textContent;
                            }

                            const user_start = chronicle.getElementsByTagName("startedAt")[0];
                            const user_start_year = user_start.getElementsByTagName("year")[0].textContent;
                            const user_start_month = user_start.getElementsByTagName("month")[0].textContent;
                            const user_start_day = user_start.getElementsByTagName("day")[0].textContent;
                            const user_start_date = `${user_start_year}-${user_start_month}-${user_start_day}`;

                            const user_last = chronicle.getElementsByTagName("completedAt")[0];
                            const user_last_year = user_last.getElementsByTagName("year")[0].textContent;
                            const user_last_month = user_last.getElementsByTagName("month")[0].textContent;
                            const user_last_day = user_last.getElementsByTagName("day")[0].textContent;
                            const user_finish_date = `${user_last_year}-${user_last_month}-${user_last_day}`;

                            const user_rating = chronicle.getElementsByTagName("score")[0].textContent;
                            const user_status = chronicle.getElementsByTagName("status")[0].textContent;
                            const user_comments = chronicle.getElementsByTagName("notes")[0].textContent;

                            if (title == "" || entertainment_category == "" || title == null || entertainment_category == null) {
                                continue;
                            }

                            if (num_of_episodes == "") {
                                num_of_episodes = null;
                            }

                            const imported_chronicle : importedChronicle = {
                                title: title,
                                category: entertainment_category,
                                num_episodes: num_of_episodes,
                                episodes_watched: user_watched_or_read,
                                user_rating: user_rating,
                                user_start_date: user_start_date,
                                user_last_watched: user_finish_date,
                                user_status: user_status,
                                comments: user_comments
                            }

                            let cleaned_chronicle : importedChronicle = chronicleDataMapping(imported_chronicle);
                            filteredImportedChronicles.push(cleaned_chronicle);
                        }
                    }

                    setChroniclesToImport(prevValue => filteredImportedChronicles);
                };

            }

            // Read the file as text
            reader.readAsText(file);
        }
    }

    function chronicleDataMapping(raw_chronicle: importedChronicle) {
        let current_category = raw_chronicle.category;
        switch (current_category) {
            case 'TV': 
            case 'ONA':
            case 'OVA':
                raw_chronicle.category = "Show";
                break;
            case 'Movie':
                raw_chronicle.category = "Film";
                break;
        }
        
        let start_date = raw_chronicle.user_start_date;
        if (start_date == "0000-00-00" || start_date == "--") {
            raw_chronicle.user_start_date = "";
        }

        let end_date = raw_chronicle.user_last_watched;
        if (end_date == "0000-00-00" || end_date == "--") {
            raw_chronicle.user_last_watched = "";
        }

        let user_status = raw_chronicle.user_status;
        switch (user_status) {
            case 'Watching':
            case 'CURRENT':
                raw_chronicle.user_status = "Reading";
                break;
            case 'Plan to Watch':
            case 'PLANNING':
                raw_chronicle.user_status = "Plan to Read";
                break;
            case 'REPEATING':
                raw_chronicle.user_status = "Rereading";
                break;
            case 'On-Hold':
            case 'PAUSED':
                raw_chronicle.user_status = "Paused";
                break;
            case 'DROPPED':
                raw_chronicle.user_status = "Dropped";
                break;
            case 'COMPLETED':
                raw_chronicle.user_status = "Completed";
                break;
        }

        if (raw_chronicle.user_rating != null) {
            let user_rating = parseFloat(raw_chronicle.user_rating);

            if (Number.isNaN(user_rating)) {
                raw_chronicle.user_rating = null;
            }

            // divide by 2, then round to one decimal point to match myChronicle rating scheme
            let myChroniclesRating = Math.round((user_rating/2) * 10)/10;

            raw_chronicle.user_rating = myChroniclesRating.toString();
        }
        
        return raw_chronicle;
    }

    async function sendImports() {
        console.log(chroniclesToImport);
        const importUserChroniclesResult = await fetch(`${apiLink}/user/import`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/text' // Example: Accept JSON responses
            },
            credentials: 'include',
            body: JSON.stringify({
                "importedChronicles": chroniclesToImport,
            })
        });

        let result = await importUserChroniclesResult.status;
        notify(result);
        toggleImportChronicles();
    }

    function notify(statusCode: number) {
        if (statusCode == 200) {
            toast.success("successfully added");
        } else {
            toast.error("Something went wrong");
        }
    }

    return(
        <div className='overlay'>
            <div className='overlay-container delete-chronicle'>
                <h1 className='no-top-margin page-title blue-text'>Import</h1>
                <div className="drop-zone">
                    <input name="myFile" type="file" onChange={handleFile}></input>
                    <div className='import-preview'>
                        <p>&#91;</p>
                        {chroniclesToImport.map((importInfo, index) => (
                            <div key={index}>
                                <p className='indent-one'>&#123;</p>
                                <div className='import-chronicle-list'>
                                    <p className='indent-two'>Title: {importInfo.title},</p>
                                    <p className='indent-two'>Episodes Watched: {importInfo.episodes_watched == "" ? "-" : importInfo.episodes_watched}</p>
                                    <p className='indent-two'>Start Date: {importInfo.user_start_date == "" ? "-" : importInfo.user_start_date },</p>
                                    <p className='indent-two'>Last Watched: {importInfo.user_last_watched == "" ? "-" : importInfo.user_start_date},</p>
                                    <p className='indent-two'>Status: {importInfo.user_status == "" ? "-" : importInfo.user_status},</p>
                                    <p className='indent-two'>Comments: {importInfo.comments == "" ? "-" : importInfo.comments}</p>
                                </div>
                                <p className='indent-one'> &#125;,</p>
                            </div>
                        ))}
                        <p>&#93;</p>
                    </div>
                    <p>Currently supports XML imports from <a className='blue-bottom' href='https://malscraper.azurewebsites.net/'>malscraper</a> and <a href='https://myanimelist.net/panel.php?go=export' className='blue-bottom'>MAL</a>.</p>
                </div>
                <div className='overlay-container-button-container'>
                    <button onClick={toggleImportChronicles} className='no overlay-container-button'>Cancel</button>
                    <button onClick={sendImports} className='no overlay-container-button'>Submit</button>
                </div>
            </div>
        </div>
    )
}
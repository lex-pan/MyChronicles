import { revalidatePath } from "next/cache";
import Search from "./Search";
import apiLink from "../utils/apiLink";

async function retrieveChronicleData() {
    const searchResults = await fetch(`${apiLink}/chronicles/search/default`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json', // Example: Accept JSON responses
        },
    });

    return searchResults.json();
}

export default async function ssSearch() {
    revalidatePath('/chronicle/[chronicleId]', 'page');
    const defaultSearchResults = await retrieveChronicleData();
        
    return (
        <Search defaultSearchResults={defaultSearchResults}/>
    )
}
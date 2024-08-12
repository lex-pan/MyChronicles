import { revalidatePath } from "next/cache";
import Search from "./Search";

async function retrieveChronicleData() {
    const searchResults = await fetch(`http://localhost:5172/chronicles/search/default`, {
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
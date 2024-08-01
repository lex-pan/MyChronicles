import { revalidatePath } from "next/cache";
import ChronicleReviews from "./ChronicleReviews";

async function retrieveChronicleData(chronicleId: string) {
    const chronicleReviews = await fetch(`http://localhost:5172/chronicles/reviews/${chronicleId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/text' // Example: Accept JSON responses
        },
        //next: {revalidate: 3600}
    });

    return chronicleReviews.json();
}

export default async function ssChronicle({params} : {params : { chronicleId : string}}) {
    revalidatePath('/chronicle/[chronicleId]', 'page');

    //let chronicleReviews = await retrieveChronicleData(params.chronicleId);
    //console.log(chronicleReviews);
    return (
        <ChronicleReviews/>
    )
}
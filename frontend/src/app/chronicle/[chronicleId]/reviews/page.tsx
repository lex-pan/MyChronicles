import { revalidatePath } from "next/cache";
import ChronicleReviews from "./ChronicleReviews";
import { cookies } from "next/headers";

async function retrieveChronicleData(chronicleId: string) {
    const chronicleReviews = await fetch(`http://localhost:5172/chronicles/reviews/${chronicleId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json', // Example: Accept JSON responses
            Cookie: cookies().toString()  // includes cookies, since credentials include is for client side

        },
    });

    return chronicleReviews.json();
}

export default async function ssReviews({params} : {params : { chronicleId : string}}) {
    revalidatePath('/chronicle/[chronicleId]', 'page');
    const chronicleReviews = await retrieveChronicleData(params.chronicleId);
    
    console.log(chronicleReviews);
    
    return (
        <ChronicleReviews user_review={chronicleReviews.user_review} reviews={chronicleReviews.reviews} chronicleID={params.chronicleId}/>
    )
}
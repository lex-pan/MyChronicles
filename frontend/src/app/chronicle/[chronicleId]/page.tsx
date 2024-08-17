import Chronicle from "./Chronicle";
import { revalidatePath } from "next/cache";
import apiLink from '@/app/utils/apiLink';

async function retrieveChronicleData(chronicleId: string) {
    const chronicle = await fetch(`${apiLink}/chronicles/detailed-chronicle/${chronicleId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/text' // Example: Accept JSON responses
        }
    });

    return chronicle.json();
}

export default async function ssChronicle({params} : {params : { chronicleId : string}}) {
    revalidatePath('/chronicle/[chronicleId]', 'page');

    let chronicleData = await retrieveChronicleData(params.chronicleId);
    console.log(chronicleData);
    return (
        <Chronicle allInfo={chronicleData}/>
    )
}
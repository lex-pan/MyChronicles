/*
ToDo's right now
    - implement permission based system (owner can edit, viewers can only view)
    - retrieve data from db and display it
    - implement db actions for chronicles request, delete, update

Future ToDo's for this section
    - implement react window for smooth user exp in the case we are overwhelmed
    - data caching and modification when user decides to change it 
    - QOL filter actions on chronicles
    - different ways to categorize chronicles 
*/
import { cookies } from "next/headers";
import { UserchronicleFetch } from "@/app/utils/interfaces";
import UserChroniclesLayout from "./UserChroniclesContainer";
import { revalidatePath } from 'next/cache'
import apiLink from '@/app/utils/apiLink';
// https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes 

async function retrieveUserChronicleData(username : string) {
    const response = await fetch(`${apiLink}/user/${username}/chronicles`, {
        method: 'GET',
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            Cookie: cookies().toString()  // includes cookies, since credentials include is for client side
        }
    });
    
    return response.json();
}

export default async function SSUserChronicleData({params} : {params : { username : string}}) {
    revalidatePath(`/user-profile/[username]/chronicles`, 'page');

    const response : UserchronicleFetch | string = await retrieveUserChronicleData(params.username);
    console.log(response);
    console.log(typeof response != 'string' && 'convertedUC' in response);
    if (response == null || response == 'username does not exist') {
        return (
            <UserChroniclesLayout ssProfileUC={undefined} profileUsername={params.username} profileExists={false}/>
        );
    } else if (typeof response != 'string' && 'convertedUC' in response) {
        return (
            <UserChroniclesLayout ssProfileUC={response.convertedUC} profileUsername={params.username} profileExists={true}/>
        );
    } else {
        return (
            <UserChroniclesLayout ssProfileUC={undefined} profileUsername={params.username} profileExists={true}/>
        );
    }
}

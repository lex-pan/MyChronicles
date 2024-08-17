import { UserProfileFetch } from "@/app/utils/interfaces";
import UserProfileAbout from "./About";
import { revalidatePath } from 'next/cache'
import apiLink from '@/app/utils/apiLink';

async function retrieveUserChronicleData(username : string) {
    const response = await fetch(`${apiLink}/user/${username}/profile`, {
        method: 'GET',
        credentials: 'include', // Include cookies with the request
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
    
    return response.json();
}

export default async function SSUserChronicleData({params} : {params : { username : string}}) {
    revalidatePath(`/user-profile/[username]/`, 'page');

    const data : UserProfileFetch = await retrieveUserChronicleData(params.username);
    return (
        <UserProfileAbout data={data} username={params.username}/>
    );
}
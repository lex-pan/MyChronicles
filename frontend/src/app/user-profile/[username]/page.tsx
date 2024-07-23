import { UserProfileFetch } from "@/app/utils/interfaces";
import UserProfileAbout from "./About";
import { revalidatePath } from 'next/cache'

async function retrieveUserChronicleData(username : string) {
    const response = await fetch(`http://localhost:5172/user/${username}/profile`, {
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
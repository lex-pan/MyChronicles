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
import { UserchronicleFetch } from "@/app/utils/interfaces";
import UserChroniclesLayout from "./UserChroniclesContainer";
import { revalidatePath } from 'next/cache'
// https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes 

async function retrieveUserChronicleData(username : string) {
    const response = await fetch(`http://localhost:5172/user/${username}/chronicles`, {
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
    revalidatePath(`/username/[username]/chronicles`, 'page');

    const data : UserchronicleFetch = await retrieveUserChronicleData(params.username);
    return (
       <UserChroniclesLayout user_chronicles={data.value} viewers_username={data.viewers_username} username={params.username}/>
  );
}

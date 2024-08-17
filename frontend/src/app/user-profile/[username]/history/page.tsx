// can add a search bar
// can add a delete history button
import UserHistory from "./UserHistory";
import { UserHistoryData } from "@/app/utils/interfaces";
import { revalidatePath } from "next/cache";
import apiLink from '@/app/utils/apiLink';

async function retrieveUserHistory(username: string) {
  const userHistory = await fetch(`${apiLink}/user/${username}/history/0`, {
    method: 'GET',
    headers: {
        'Accept': 'application/json' // Example: Accept JSON responses
    }
  });

  return userHistory.json();
}
//     [HttpGet("{username}/history/{page_number}")]

export default async function ssUserHistory({params} : {params : { username : string}}) {  
    revalidatePath(`/user-profile/[username]/history`, 'page');

    let userHistory : Array<UserHistoryData> = await retrieveUserHistory(params.username);
    
    return (
      <UserHistory history={userHistory} username={params.username}/>
    );
}
  
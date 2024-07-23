import { revalidatePath } from 'next/cache'

async function initializeUserProfile(username : string) {
    const response = await fetch(`http://localhost:5172/user/${username}/exists`, {
        method: 'GET',
        credentials: 'include', // Include cookies with the request
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
    
    return response.json();
}

export default async function ValidPage({ children, params } : Readonly<{
    children: React.ReactNode, params : { username : string};
}>) {
    revalidatePath('/user-profile/[username]', 'page');
    let profileInitialization = await initializeUserProfile(params.username);

    if (typeof profileInitialization == 'string' && profileInitialization == 'username does not exist') {
        return(
            <div>404: Profile does not exist</div>
        )
    } else {
        return(
            <>
            {children}
            </>
        )
    }
}
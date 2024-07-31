import { revalidatePath } from 'next/cache'

async function initializeChronicle(chronicleId : string) {
    const response = await fetch(`http://localhost:5172/chronicles/${chronicleId}/exists`, {
        method: 'GET',
    });
    
    return response.json();
}

export default async function ValidPage({ children, params } : Readonly<{
    children: React.ReactNode, params : { chronicleId : string};
}>) {
    revalidatePath('/chronicle/[chronicleId]', 'page');
    console.log(params.chronicleId);
    let chronicleInitialization = await initializeChronicle(params.chronicleId);

    console.log(typeof(chronicleInitialization));
    if (typeof chronicleInitialization == 'boolean' && chronicleInitialization == true) {
        return(
            <>
            {children}
            </>
        )
    } else {
        return(
            <div>404: Chronicle does not exist</div>
        )
    }
}
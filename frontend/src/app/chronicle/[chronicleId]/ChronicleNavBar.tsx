import Link from 'next/link';

export default function ChronicleNavBar({params} : {params : {chronicleId : string}}) {
    return(
        <div className='chronicles-nav-bar'>
            <Link href={`/chronicle/${params.chronicleId}`} className='chronicles-nav-bar-option'>Overview</Link>
            <Link href={`/chronicle/${params.chronicleId}/reviews`} className='chronicles-nav-bar-option'>Reviews</Link>
            <Link href={`/chronicle/${params.chronicleId}/about`} className='chronicles-nav-bar-option'>Summary</Link>
        </div>
    )
}
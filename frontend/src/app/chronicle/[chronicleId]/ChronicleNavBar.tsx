import Link from 'next/link';

export default function ChronicleNavBar() {
    return(
        <div className='chronicles-nav-bar'>
            <Link href="/chronicle" className='chronicles-nav-bar-option'>Overview</Link>
            <Link href="/chronicle/reviews" className='chronicles-nav-bar-option'>Reviews</Link>
            <Link href="/chronicle/summary" className='chronicles-nav-bar-option'>Summary</Link>
        </div>
    )
}
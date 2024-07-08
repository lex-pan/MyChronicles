'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavOptions() {
  const pathname = usePathname();
  const segments = pathname.split('/');
  const username = segments[segments.indexOf('user-profile') + 1]; // Extract the username
  
  return (
    <div className="nav-category-options">
      <Link key={0} href={`/user-profile/${username}`} className='nav-category-options-container'>
        <p className='nav-category-options-title'>About</p>
      </Link>
      <Link key={1} href={`/user-profile/${username}/chronicles`} className='nav-category-options-container'>
        <p className='nav-category-options-title'>Chronicles</p>
      </Link>
      <Link key={2} href={`/user-profile/${username}/history`} className='nav-category-options-container'>
        <p className='nav-category-options-title'>History</p>
      </Link>
      <Link key={3} href={`/user-profile/${username}/statistics`} className='nav-category-options-container'>
        <p className='nav-category-options-title'>Statistics</p>
      </Link>
    </div>
  );
}

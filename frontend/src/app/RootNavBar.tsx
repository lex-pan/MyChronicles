'use client';
import { log } from 'console';
import Link from 'next/link';

export default function RootNavBar() {
    
    async function handleLogOut() {
        const logoutResult = await fetch('http://localhost:5172/user/logout', {
            method: 'GET',
        });
        
        console.log(logoutResult);
    }

  return (
    <nav className="nav-bar">
        <h1 className="nav-bar-title">MyChronicles</h1> 
        <Link href="/about" className="nav-link">About</Link> 
        <Link href="/search" className="nav-link">Search</Link>
        <Link href="/add" className="nav-link">Add</Link> 
        <Link href="/user-profile" className="nav-link">Profile</Link> 
        <Link href="/user-profile"><img className="nav-profile" src="images/default-profile-image.png"/></Link> 
        <button onClick={handleLogOut}><img className="nav-logout" src="images/logout.png"/></button> 
    </nav>
  );
}

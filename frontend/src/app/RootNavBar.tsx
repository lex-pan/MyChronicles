'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

export default function RootNavBar() {
  const router = useRouter();
  const pathname = usePathname(); // Move hook call outside to avoid conditional hook call

  // in this function when you send a fetch request, you need to send the user cookie
  // this way the api can identify which user you are using the credentials: include
  async function handleLogOut() {
      const logoutResult = await fetch('http://localhost:5172/user/logout', {
          method: 'GET',
          credentials: 'include', // Include cookies with the request
      });
      
      console.log(logoutResult);
  }
  
  // in this function when you send a fetch request, you need to send the user cookie
  // this way the api can identify which user you are using the credentials: include
  async function handleProfileClick() {
    const request = await fetch('http://localhost:5172/user/login-status', {
      method: 'GET',
      credentials: 'include', // Include cookies with the request
    });
    
    const isLoggedIn = await request.text();
    console.log(isLoggedIn);
    if (isLoggedIn == "false") {
      console.log("going to login");
      router.push("/login?toProfile=true");
    } else {
      console.log("going to profile");
      // redirect to user-profile
      router.push("/user-profile");
    }
  }

  return (
    <nav className="nav-bar">
        <h1><Link href="/about.html" className="nav-bar-title">MyChronicles</Link></h1> 
        <Link href="/search" className="nav-link">Search</Link>
        <Link href="/add" className="nav-link">Add</Link> 
        <p onClick={handleProfileClick} className="nav-link">Profile</p> 
        <img className="nav-profile" onClick={handleProfileClick} src="images/default-profile-image.png"/>
        <img onClick={handleLogOut} className="nav-logout" src="images/logout.png"/>
    </nav>
  );
}

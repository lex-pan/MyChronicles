'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useAppSelector, useAppDispatch, useAppStore } from '../globalRedux/hooks';
import { logout } from '@/globalRedux/features/User/UserChroniclesSlice';

export default function RootNavBar() {
  const pathname = usePathname();
  const [navBarColor, setNavBarColor] = useState(pathname === '/' ? 'rgb(232, 116, 255)' : 'rgb(0, 153, 255)');
  let isLoggedIn = useAppSelector((state) => state.UserChronicles.loggedIn);
  let username = useAppSelector((state) => state.UserChronicles.username);
  let userChronicles = useAppSelector((state) => state.UserChronicles.userChronicles);
  const dispatch = useAppDispatch();
  console.log(username);
  useEffect(() => {
    setNavBarColor(pathname === '/' ? 'rgb(232, 116, 255)' : 'rgb(0, 153, 255)');
  }, [pathname]);

  // in this function when you send a fetch request, you need to send the user cookie
  // this way the api can identify which user you are using the credentials: include
  async function handleLogOut() {
      const logoutResult = await fetch('http://localhost:5172/user/logout', {
          method: 'GET',
          credentials: 'include', // Include cookies with the request
      });
      
      console.log(logoutResult);
      
      dispatch(logout());
  }

  return (
    <>
      { isLoggedIn &&
        <nav className="nav-bar" style={{backgroundColor: navBarColor}}>
          <h1><Link href="/" className="nav-bar-title">MyChronicles</Link></h1> 
          <Link href="/search" className="nav-link">Search</Link>
          <Link href="/add" className="nav-link">Add</Link> 
          <Link href={`/user-profile/${username}`} className="nav-link">Profile</Link> 
          <Link href={`/user-profile/${username}`}><img className="nav-profile" src="/images/default-profile-image.png"/></Link>
          <img onClick={handleLogOut} className="nav-logout" src="/images/logout.png"/>
        </nav>
      }
      { !isLoggedIn &&
        <nav className="nav-bar" style={{backgroundColor: navBarColor}}>
          <h1><Link href="/" className="nav-bar-title">MyChronicles</Link></h1> 
          <Link href="/search" className="nav-link">Search</Link>
          <Link href="/add" className="nav-link">Add</Link> 
          <Link href="/login" className="nav-link">Profile</Link> 
          <Link href="/login"><img className="nav-profile" src="/images/default-profile-image.png"/></Link>
          <img onClick={handleLogOut} className="nav-logout" src="/images/logout.png"/>
        </nav>
      }
    </>

  );
}

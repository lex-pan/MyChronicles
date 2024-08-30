'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch, useAppStore } from '../globalRedux/hooks';
import { logout } from '@/globalRedux/features/User/UserChroniclesSlice';
import apiLink from '@/app/utils/apiLink';

export default function RootNavBar() {
  const pathname = usePathname();
  const [navBarColor, setNavBarColor] = useState(pathname === '/' ? 'rgb(232, 116, 255)' : 'rgb(0, 153, 255)');
  const [showDropdown, setShowDropdown] = useState(false);
  let isLoggedIn = useAppSelector((state) => state.UserChronicles.loggedIn);
  let username = useAppSelector((state) => state.UserChronicles.username);
  let userChronicles = useAppSelector((state) => state.UserChronicles.userChronicles);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setNavBarColor(pathname === '/' ? 'rgb(232, 116, 255)' : 'rgb(0, 153, 255)');
  }, [pathname]);

  function handleClick() {
    console.log('working');
    if (showDropdown){
      setShowDropdown(false);
    }else{
      setShowDropdown(true);
    }
    
  }


  // in this function when you send a fetch request, you need to send the user cookie
  // this way the api can identify which user you are using the credentials: include
  async function handleLogOut() {
      const logoutResult = await fetch(`${apiLink}/user/logout`, {
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
          <Link href="/contribute" className="nav-link">Contribute</Link> 
          
          <Link href={`/user-profile/${username}`} className="nav-link">Profile</Link> 
          <Link href={`/user-profile/${username}`}><img className="nav-profile" src="/images/default-profile-image.png"/></Link>
          <img onClick={handleLogOut} className="nav-logout" src="/images/logout.png"/>
          <div className="nav-mobile">  
            <div style={{height: '3.7em'}}></div>
            <button className="nav-dropdown"  onClick={handleClick}><img id="nav-dropdown-arrow" src="/images/arrow_icon.png" alt="dropdown arrow" style={{transition: '0.5s', transform: showDropdown ? 'none' : 'rotate(180deg)' }} /></button>
            <div style={{ display: showDropdown ? 'block' : 'none' }} >
              <Link style={{width: '100%', transition: '0.5s', top: showDropdown ? '100' : '0' }} href="/search" className="nav-link-m">Search</Link>
              <Link style={{width: '100%', transition: '0.5s', top: showDropdown ? '200' : '0' }} href="/contribute" className="nav-link-m">Contribute</Link> 
              <Link style={{width: '100%', transition: '0.5s', top: showDropdown ? '300' : '0' }} href="/login?post=profile" className="nav-link-m">Profile</Link> 
            </div>
          </div>
        </nav>
      }
      { !isLoggedIn &&
        <nav className="nav-bar" style={{backgroundColor: navBarColor}}>
          <h1><Link href="/" className="nav-bar-title">MyChronicles</Link></h1> 
          
          <Link href="/search" className="nav-link">Search</Link>
          <Link href="/contribute" className="nav-link">Contribute</Link> 
          <Link href="/login?post=profile" className="nav-link">Profile</Link> 

          <Link href="/login?post=profile"><img className="nav-profile" src="/images/default-profile-image.png"/></Link>
          <img onClick={handleLogOut} className="nav-logout" src="/images/logout.png"/>
          <div className="nav-mobile">  
            <div style={{height: '3.7em'}}></div>
            <button className="nav-dropdown"  onClick={handleClick}><img id="nav-dropdown-arrow" src="/images/arrow_icon.png" alt="dropdown arrow" style={{transition: '0.5s', transform: showDropdown ? 'none' : 'rotate(180deg)' }} /></button>
            <div style={{ display: showDropdown ? 'block' : 'none' }} >
              <Link style={{width: '100%', transition: '0.5s', top: showDropdown ? '100' : '0' }} href="/search" className="nav-link-m">Search</Link>
              <Link style={{width: '100%', transition: '0.5s', top: showDropdown ? '200' : '0' }} href="/contribute" className="nav-link-m">Contribute</Link> 
              <Link style={{width: '100%', transition: '0.5s', top: showDropdown ? '300' : '0' }} href="/login?post=profile" className="nav-link-m">Profile</Link> 
            </div>
          </div>
        </nav>
      }
    </>

  );
}

"use client"
import Link from "next/link"
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Footer() {
    const pathname = usePathname();
    const [navBarColor, setNavBarColor] = useState(pathname === '/' ? 'var(--primary-pink)' : 'var(--primary-blue)');
    const [darkMode, darkModeToggle] = useState(false);

    useEffect(() => {
        setNavBarColor(pathname === '/' ? 'var(--primary-pink)' : 'var(--primary-blue)');
      }, [pathname]);
    
    function handleDarkModeToggle() {
        if (darkMode){
            document.documentElement.style.setProperty('--white-bg', 'white');
            document.documentElement.style.setProperty('--primary-pink', 'rgb(232, 116, 255)');
            document.documentElement.style.setProperty('--primary-blue', 'rgb(0, 153, 255)');
            document.documentElement.style.setProperty('--black-text', 'black');
            document.documentElement.style.setProperty('--white-text', 'white');
            darkModeToggle(false);
        }else{
            document.documentElement.style.setProperty('--white-bg', 'rgb(63, 63, 63)');
            document.documentElement.style.setProperty('--primary-pink', 'rgb(171, 106, 184)');
            document.documentElement.style.setProperty('--primary-blue', 'rgb(50, 117, 161)');        
            document.documentElement.style.setProperty('--black-text', 'white');
            //document.documentElement.style.setProperty('--white-text', 'black');
            darkModeToggle(true);
        }
    
    }

    return(
        <div className="footer" style={{backgroundColor: navBarColor}}>
            
            <Link href="/policy">Privacy Policy</Link>
            <Link href="/contact">About/Contact Me</Link>
            <p className="footer-second">© 2024 Lex Pan. All rights reserved </p>
            <label className="darkmode-switch" htmlFor="darkModeCheckbox">
                
                <input type="checkbox" id="darkModeCheckbox" onClick={handleDarkModeToggle}/>
                
                <div className="slider round">
                </div>
                <p className="footer-second" style={{transition: '0.5s', transform: 'rotate(-30deg)', color: darkMode ? 'black' : 'white' }}>Dark Mode</p>
            </label>
        </div>
    )
}
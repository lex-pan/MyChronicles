"use client"
import Link from "next/link"
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Footer() {
    const pathname = usePathname();
    const [navBarColor, setNavBarColor] = useState(pathname === '/' ? 'rgb(232, 116, 255)' : 'rgb(0, 153, 255)');

    useEffect(() => {
        setNavBarColor(pathname === '/' ? 'rgb(232, 116, 255)' : 'rgb(0, 153, 255)');
      }, [pathname]);

    return(
        <div className="footer" style={{backgroundColor: navBarColor}}>
            <Link href="/policy">Privacy Policy</Link>
            <Link href="/contact">About/Contact Me</Link>
            <p className="footer-second">© 2024 Lex Pan. All rights reserved</p>
        </div>
    )
}
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyChronicles",
  description: "Track all you read and watch online in one place",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="nav-bar">
          <h1 className="nav-bar-title">MyChronicles</h1> 
          <Link href="/about" className="nav-link">About</Link> 
          <Link href="/search" className="nav-link">Search</Link>
          <Link href="/add" className="nav-link">Add</Link> 
          <Link href="/user-profile" className="nav-link">Profile</Link> 
          <Link href="/user-profile"><img className="nav-profile" src="images/default-profile-image.png"/></Link> 
        </nav>
        {children}
      </body>
    </html>
  );
}

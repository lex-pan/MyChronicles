// remember to attribute user and logout icons in bottom of page
// attribution links: <a href="https://www.flaticon.com/free-icons/logout" title="logout icons">Logout icons created by Afian Rochmah Afif - Flaticon</a>
// attribution to second link: <a href="https://www.flaticon.com/free-icons/user" title="user icons">User icons created by Freepik - Flaticon</a>
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import RootNavBar from "./RootNavBar";
import Footer from "./Footer";
import { Toaster } from 'react-hot-toast';
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
        <StoreProvider>
          <RootNavBar/>
          <div className="nav-bar-margin">&nbsp;</div>
          {children}
          <Footer/>
          <Toaster position="bottom-right"/>
        </StoreProvider>
      </body>
    </html>
  );
}
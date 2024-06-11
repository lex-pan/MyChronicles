import NavOptions from './navOptions';

const titles = [
    {category: "About", index: 0, link: "/user-profile"},
    {category: "Chronicles", index: 1, link: "/user-profile/chronicles"},
    {category: "History", index: 2, link:"/user-profile/history"},
    {category: "Statistics", index: 3, link:"/user-profile/statistics"}
]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='user-profile-container'>
        < NavOptions navCategory={titles}/>
        {children}
    </div>
  );
}

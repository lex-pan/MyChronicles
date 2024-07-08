import NavOptions from './navOptions';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='user-profile-container'>
        < NavOptions />
        {children}
    </div>
  );
}

import NavOptions from './navOptions';
import ValidPage from './ValidPage';

export default function RootLayout({
  children, params
}: Readonly<{
  children: React.ReactNode, params : {username: string};
}>) {
  return (
    <div className='user-profile-container'>
      < NavOptions />
      {children}
    </div>
  );
}
/*
      <ValidPage params={params}>
        < NavOptions />
        {children}
      </ValidPage>
*/
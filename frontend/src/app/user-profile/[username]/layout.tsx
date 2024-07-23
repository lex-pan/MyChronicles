import NavOptions from './navOptions';
import ValidPage from './ValidPage';

export default function RootLayout({
  children, params
}: Readonly<{
  children: React.ReactNode, params : {username: string};
}>) {
  return (
    <ValidPage params={params}>
      <div className='user-profile-container'>
        < NavOptions />
        {children}
      </div>
  </ValidPage>
  );
}

/*
      <ValidPage params={params}>
        < NavOptions />
        {children}
      </ValidPage>
*/
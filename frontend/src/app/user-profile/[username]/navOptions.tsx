import Link from 'next/link';

export default function NavOptions({params} : {params : { username : string}}) {
  console.log(params);
  return (
    <div className="nav-category-options">
      <Link key={0} href={`/user-profile/${params.username}`} className='nav-category-options-container'>
        <p className='nav-category-options-title'>About</p>
      </Link>
      <Link key={1} href={`/user-profile/${params.username}/chronicles`} className='nav-category-options-container'>
        <p className='nav-category-options-title'>Chronicles</p>
      </Link>
      <Link key={2} href={`/user-profile/${params.username}/history`} className='nav-category-options-container'>
        <p className='nav-category-options-title'>History</p>
      </Link>
      <Link key={3} href={`/user-profile/${params.username}/statistics`} className='nav-category-options-container'>
        <p className='nav-category-options-title'>Statistics</p>
      </Link>
    </div>
  );
}

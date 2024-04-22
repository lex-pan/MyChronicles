import Link from 'next/link';

type Props = {
    navCategory: {category: string; index: number, link: string}[];
}

export default function NavOptions(props: Props) {
  return (
    <div className="nav-category-options">
        {props.navCategory.map((title) => (
            <Link key={title.index} href={title.link} className='nav-category-options-container'>
                  <p className='nav-category-options-title'>{title.category}</p>
            </Link>
        ))}
    </div>
  );
}

import Link from 'next/link';

const Header: React.FC = () => (
  <header className="bg-gray-800 p-4 text-white">
    <nav>
      <Link href="/">Home</Link>
      <Link href="/food-log" className="ml-4">Food Log</Link>
      <Link href="/analytics" className="ml-4">Analytics</Link>
    </nav>
  </header>
);

export default Header;

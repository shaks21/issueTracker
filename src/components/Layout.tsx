import { ReactNode, useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Issues from './Issues';
import Link from 'next/link';
import useLoggedInUser from '../hooks/useLoggedInUser';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const { loggedInUser, handleLogout } = useLoggedInUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  return (
    <>
      <Head>
        <title>Issue Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className="flex flex-wrap md:flex-nowrap justify-between items-center bg-gray-800 text-white p-5">
  <div className="flex-shrink-0 w-full md:w-auto">
    <Link href="/">
      <div className="font-bold text-xl">Issue Tracker</div>
    </Link>
  </div>
  <ul className="flex flex-wrap md:flex-nowrap">
    <li className="ml-5">
      <Link href="/">
        <div className="hover:text-gray-400">Home</div>
      </Link>
    </li>
    <li className="ml-5">
      <Link href="/new-issue">
        <div className="hover:text-gray-400">Create New Issue</div>
      </Link>
    </li>
    <li className="ml-5">
      <Link href="/edit-issue">
        <div className="hover:text-gray-400">Edit Issue</div>
      </Link>
    </li>
    <li className="ml-5">
      {loggedInUser ? (
        <div className="relative" ref={dropdownRef}>
          <div className="cursor-pointer" onClick={toggleMenu}>
            {loggedInUser.email}
          </div>
          {isMenuOpen && (
            <div className="absolute top-full left-0 bg-white w-full border border-gray-400 z-10">
              <div className="py-2 px-3 text-black hover:bg-gray-200 cursor-pointer" onClick={handleLogout}>
                Logout
              </div>
            </div>
          )}
        </div>
      ) : (
        <Link href="/login">
          <div className="hover:text-gray-400">Login</div>
        </Link>
      )}
    </li>
  </ul>
</nav>


      <div className="container mx-auto px-4 sm:px-6 lg:px-8">{children}</div>

    </>
  );
};

export default Layout;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ShopIcon from '../../assets/icons/ShopIcon';
import LibraryIcon from '../../assets/icons/LibraryIcon';
import GovernanceIcon from '../../assets/icons/GovernanceIcon';

interface NavItemProps {
  name: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  path: string;
}

const NavBar: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(
    window.location.hash ? window.location.hash.slice(1) : '/',
  );

  useEffect(() => {
    const handleHashChange = () => {
      const newPath = window.location.hash ? window.location.hash.slice(1) : '/';
      setCurrentPath(newPath);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const navItems: NavItemProps[] = [
    { name: 'Collection', Icon: ShopIcon, path: '/' },
    { name: 'Library', Icon: LibraryIcon, path: '/library' },
    { name: 'Governance', Icon: GovernanceIcon, path: '/governance' },
  ];

  const isActiveLink = (linkTo: string) => {
    if (linkTo === '/') {
      return currentPath === '/' || currentPath.startsWith('/collection/');
    }
    return currentPath === linkTo;
  };

  const NavItem: React.FC<{ item: NavItemProps; isActive: boolean }> = ({ item, isActive }) => {
    const content = (
      <>
        {/* Container for the icon */}
        <div
          className={`w-14 h-14 flex items-center justify-center ${
            isActive
              ? 'bg-black text-white cursor-default rounded-full'
              : 'border border-mouse text-slate hover:bg-slate/10 duration-300 ease-in-out transition-all rounded-full'
          }`}
        >
          <item.Icon className="w-6 h-6" />
        </div>
        {/* Text below the icon */}
        <div
          className={`mt-1 text-center text-[10px] uppercase tracking-wide ${
            isActive ? 'text-charcoal font-bold' : 'text-slate font-semibold'
          }`}
        >
          {item.name}
        </div>
      </>
    );

    return (
      <Link to={item.path} className="flex flex-col items-center gap-1">
        {content}
      </Link>
    );
  };

  return (
    <div className="w-full h-[158px] md:w-[88px] md:h-full fixed pt-10 z-50">
      <div className="w-full h-full px-4 py-10 bg-white border-b md:border-b-0 md:border-r border-[#e1e1e1] flex flex-row md:flex-col items-center justify-start">
        {/* Top Section */}
        <Link to="/" className="hidden md:flex flex-col items-center justify-center h-[78px] gap-1">
          <div className="w-14 h-14 flex items-center justify-center border border-gray-300 rounded-full hover:bg-slate/10 duration-300 ease-in-out transition-all">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-slate-500"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </div>
        </Link>

        <div className="flex-grow flex flex-col justify-center">
          {/* Navigation Section */}
          <div className="flex flex-row md:flex-col justify-center items-center gap-8">
            {navItems.map((item) => (
              <NavItem key={item.path} item={item} isActive={isActiveLink(item.path)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;

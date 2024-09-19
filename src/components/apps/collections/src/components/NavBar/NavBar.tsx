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
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center ${
            isActive
              ? 'bg-black text-white cursor-default'
              : 'border border-mouse text-slate hover:bg-slate/10 duration-300 ease-in-out transition-all'
          }`}
        >
          <item.Icon className="w-6 h-6" />
        </div>
        <div
          className={`text-center text-[8px] uppercase tracking-wide ${
            isActive ? 'text-charcoal font-bold' : 'text-slate font-semibold'
          }`}
        >
          {item.name}
        </div>
      </>
    );

    return isActive ? (
      <div className="flex flex-col items-center gap-2">{content}</div>
    ) : (
      <Link to={item.path} className="flex flex-col items-center gap-2">
        {content}
      </Link>
    );
  };

  return (
    <div className="w-[88px] h-full fixed">
      <div className="w-full h-full px-4 py-10 bg-white border-r border-[#e1e1e1] flex flex-col items-center justify-start">
        {/* Top Section */}
        <Link to="/" className="">
          <div className="w-14 h-14 border border-gray-300 rounded-full flex items-center justify-center hover:bg-slate/10 duration-300 ease-in-out transition-all">
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
          <div className="flex flex-col items-center gap-8">
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

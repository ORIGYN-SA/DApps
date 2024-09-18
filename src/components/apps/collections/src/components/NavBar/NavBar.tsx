import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface NavItemProps {
  name: string;
  icon: string;
  path: string;
}

// Composant pour chaque élément de navigation
const NavItem: React.FC<{ item: NavItemProps; isActive: boolean }> = ({ item, isActive }) => {
  return (
    <Link to={item.path} className="flex flex-col items-center gap-2">
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center ${
          isActive ? 'bg-black fill-white' : 'border border-gray-300'
        }`}
      >
        <img src={item.icon} alt={item.name} className="w-6 h-6" />
      </div>
      <div
        className={`text-center text-[8px] font-semibold uppercase tracking-wide ${
          isActive ? 'text-[#212425] font-extrabold' : 'text-[#69737c]'
        }`}
      >
        {item.name}
      </div>
    </Link>
  );
};

// Composant NavBar principal
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
    { name: 'Collection', icon: '/assets/shop.svg', path: '/' },
    { name: 'Library', icon: '/assets/library.svg', path: '/library' },
    { name: 'Governance', icon: '/assets/governance.svg', path: '/governance' },
  ];

  const isActiveLink = (linkTo: string) => {
    if (linkTo === '/') {
      return currentPath === '/' || currentPath.startsWith('/collection/');
    }
    return currentPath === linkTo;
  };

  return (
    <div className="w-20 h-full fixed flex flex-col items-center justify-between">
      <div className="w-full h-screen px-4 py-10 bg-white border-r border-[#e1e1e1] flex flex-col justify-between items-center">
        {/* Top Section */}
        <Link to="/">
          <div className="w-14 h-14 border border-mouse rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 text-slate"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </div>
        </Link>
        {/* Section de navigation */}
        <div className="flex flex-col items-center gap-8">
          {navItems.map((item) => (
            <NavItem key={item.path} item={item} isActive={isActiveLink(item.path)} />
          ))}
        </div>

        {/* Section inférieure */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border border-white" />
            <div className="absolute left-4 top-4 flex items-center justify-center w-6 h-6">
              {/* Icône du bas */}
              <div className="w-6 h-6">{/* Bottom Icon */}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;

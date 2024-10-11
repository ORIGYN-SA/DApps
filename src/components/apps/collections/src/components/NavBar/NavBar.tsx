import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ShopIcon from '../../assets/icons/ShopIcon';
import LibraryIcon from '../../assets/icons/LibraryIcon';
import GovernanceIcon from '../../assets/icons/GovernanceIcon';

interface NavItemProps {
  name: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  path: string;
}

const navItems: NavItemProps[] = [
  { name: 'Collection', Icon: ShopIcon, path: '/' },
  { name: 'Library', Icon: LibraryIcon, path: '/library' },
  { name: 'Governance', Icon: GovernanceIcon, path: '/governance' },
];

const NavBar: React.FC = () => {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState<string>(location.pathname);

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  const isActiveLink = (linkTo: string) =>
    linkTo === '/'
      ? currentPath === '/' || currentPath.startsWith('/collection/')
      : currentPath === linkTo;

  const NavItem: React.FC<{ item: NavItemProps; isActive: boolean }> = ({ item, isActive }) => (
    <Link to={item.path} className="flex flex-col items-center gap-1">
      <div
        className={`w-14 h-14 flex items-center justify-center ${
          isActive
            ? 'bg-black text-white rounded-full'
            : 'border border-mouse text-slate hover:bg-slate/10 transition-all duration-300 rounded-full'
        }`}
      >
        <item.Icon className="w-6 h-6" />
      </div>
      <div
        className={`mt-1 text-center text-[10px] uppercase tracking-wide ${
          isActive ? 'text-charcoal font-bold' : 'text-slate font-semibold'
        }`}
      >
        {item.name}
      </div>
    </Link>
  );

  return (
    <div className="w-full h-[158px] md:w-[88px] md:h-full fixed pt-10 z-50">
      <div className="w-full h-full px-4 py-10 bg-white border-b md:border-b-0 md:border-r border-[#e1e1e1] flex flex-row md:flex-col items-center justify-start">
        <Link to="/" className="hidden md:flex flex-col items-center justify-center h-[78px] gap-1">
          <div className="w-14 h-14 flex items-center justify-center border border-gray-300 rounded-full hover:bg-slate/10 transition-all duration-300">
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

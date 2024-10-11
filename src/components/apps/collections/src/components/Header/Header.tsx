import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ConnectWallet from '../Buttons/ConnectWallet';
import MenuIcon from '../../../../../../../public/assets/MenuIcon';
import XIcon from '../../../../../../../public/assets/XIcon';
import { useAuth } from '../../auth/hooks/useAuth';

interface LinkProps {
  title: string;
  to: string;
}

const LinkItem: React.FC<{ link: LinkProps; isActive: boolean }> = ({ link, isActive }) => (
  <Link
    to={link.to}
    className={`flex items-center justify-center text-base font-semibold ${
      isActive
        ? 'text-black font-bold underline underline-offset-[37px]'
        : 'hover:underline hover:underline-offset-[37px]'
    }`}
  >
    {link.title}
  </Link>
);

const MenuButton: React.FC<{ isOpen: boolean; toggleMenu: () => void }> = ({
  isOpen,
  toggleMenu,
}) => (
  <button className="md:hidden z-20" onClick={toggleMenu}>
    {isOpen ? (
      <XIcon className="w-10 h-10 text-main" />
    ) : (
      <MenuIcon className="w-10 h-10 text-main" />
    )}
  </button>
);

const MobileMenu: React.FC<{
  isOpen: boolean;
  links: LinkProps[];
  toggleMenu: () => void;
  menuRef: React.RefObject<HTMLDivElement>;
}> = ({ isOpen, links, toggleMenu, menuRef }) => {
  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute top-[70px] right-0 bg-white border border-mouse z-50 w-full shadow-lg md:hidden rounded-lg"
    >
      <nav className="flex flex-col items-center p-4">
        {links.map((link) => (
          <Link
            key={link.title}
            to={link.to}
            onClick={toggleMenu}
            className="w-full text-center py-2 text-black font-medium border-b border-gray-200"
          >
            {link.title}
          </Link>
        ))}
      </nav>
    </div>
  );
};

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { isConnected, connect, isConnecting } = useAuth();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = (): void => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const links: LinkProps[] = [
    { title: 'Collections', to: '/' },
    { title: 'DAOs', to: '/daos' },
  ];

  const isActiveLink = (linkTo: string) => {
    if (linkTo === '/') {
      return location.pathname === '/' || location.pathname.startsWith('/collection/');
    }
    return location.pathname === linkTo;
  };

  return (
    <header className="bg-white text-md border-b border-gray-200 h-[90px] w-full px-6 flex items-center justify-between md:justify-center">
      <MenuButton isOpen={isOpen} toggleMenu={toggleMenu} />
      <div className="hidden md:grid 4xl:max-w-7xl w-full md:justify-center md:items-center md:grid-cols-3">
        <div className="flex-grow flex justify-start" />
        <div className="flex-grow flex justify-center space-x-12">
          {links.map((link) => (
            <LinkItem key={link.to} link={link} isActive={isActiveLink(link.to)} />
          ))}
        </div>
        <div className="hidden md:flex items-center justify-end">
          <ConnectWallet />
        </div>
      </div>
      <div className="md:hidden items-center justify-end">
        {isConnected ? (
          <Link to="/profile">
            <img
              src="/assets/profile_icon.svg"
              alt="Profile Icon"
              className="w-14 h-14 md:hidden"
            />
          </Link>
        ) : (
          <button
            onClick={connect}
            disabled={isConnecting}
            className="bg-charcoal text-white px-5 py-1 text-center text-sm font-semibold rounded-full hover:scale-105 transition-transform duration-100"
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        )}
        <MobileMenu
          isOpen={isOpen}
          links={links}
          toggleMenu={() => setIsOpen(false)}
          menuRef={menuRef}
        />
      </div>
    </header>
  );
};

export default Header;

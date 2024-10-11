import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ConnectWallet from '../Buttons/ConnectWallet';
import MenuIcon from '../../../../../../../public/assets/MenuIcon';
import XIcon from '../../../../../../../public/assets/XIcon';
import { Menu } from '@mui/material';
import { useAuth } from '../../auth/hooks/useAuth';

interface LinkProps {
  title: string;
  to: string;
}

const LinkItem: React.FC<{ link: LinkProps; isActive: boolean }> = ({ link, isActive }) => {
  return (
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
};

interface MenuButtonProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({ isOpen, toggleMenu }) => (
  <button className="md:hidden z-20">
    {isOpen ? (
      <XIcon className="w-10 h-10 text-main" onClick={toggleMenu} />
    ) : (
      <MenuIcon className="w-10 h-10 text-main" onClick={toggleMenu} />
    )}
  </button>
);

interface MobileMenuProps {
  isOpen: boolean;
  links: LinkProps[];
  toggleMenu: () => void;
  menuRef: React.RefObject<HTMLDivElement>;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, links, toggleMenu, menuRef }) => {
  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute top-[70px] right-0 mt-2 bg-white border border-mouse z-50 w-full shadow-lg md:hidden rounded-lg"
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
  const [currentPath, setCurrentPath] = useState<string>(
    window.location.hash ? window.location.hash.slice(1) : '/',
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { isConnected, connect, isConnecting } = useAuth();
  const location = useLocation();

  const toggleMenu = (): void => {
    setIsOpen(!isOpen);
  };

  const menuRef = useRef<HTMLDivElement>(null);

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

  const links: LinkProps[] = [
    { title: 'Collections', to: '/' },
    { title: 'DAOs', to: '/daos' },
  ];

  const isActiveLink = (linkTo: string) => {
    if (linkTo === '/') {
      return currentPath === '/' || currentPath.startsWith('/collection/');
    }
    return currentPath === linkTo;
  };

  return (
    <header className="bg-white text-md border-b border-gray-200 h-[90px] w-full px-6 flex flex-row items-center justify-between md:justify-center">
      <MenuButton isOpen={isOpen} toggleMenu={toggleMenu} />
      <div className="hidden md:grid 4xl:max-w-7xl w-full md:justify-center md:items-center md:grid-cols-3">
        <div className="flex-grow flex justify-start"></div>
        <div className="flex-grow flex justify-center space-x-12">
          {links.map((link) => (
            <LinkItem key={link.to} link={link} isActive={isActiveLink(link.to)} />
          ))}
        </div>
        <div className="hidden md:flex items-center justify-center md:justify-end pt-2 md:pt-0">
          <ConnectWallet />
        </div>
      </div>
      {location.pathname !== '/profile' ? (
        <Link to="/profile">
          <img
            src="/assets/profile_icon.svg"
            alt="Profile Icon"
            className="w-14 h-14 md:hidden"
            onClick={connect}
          />
        </Link>
      ) : (
        <img
          src="/assets/profile_icon.svg"
          alt="Profile Icon"
          className="w-14 h-14 md:hidden"
          onClick={connect}
        />
      )}
      <MobileMenu isOpen={isOpen} links={links} toggleMenu={toggleMenu} menuRef={menuRef} />
    </header>
  );
};

export default Header;

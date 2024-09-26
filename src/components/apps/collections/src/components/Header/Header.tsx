import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ConnectWallet from '../Buttons/ConnectWallet';

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

const Header: React.FC = () => {
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
    <nav className="bg-white text-sm border-b border-gray-200 h-[160px] md:h-[90px] w-full px-6 flex flex-row items-center justify-center">
      <div className="4xl:max-w-7xl w-full md:justify-center md:items-center md:grid md:grid-cols-3">
        {/* Left Column - Empty*/}
        <div className="flex-grow flex justify-start space-x-12"></div>
        <div className="flex-grow flex justify-center space-x-12">
          {links.map((link) => (
            <LinkItem key={link.to} link={link} isActive={isActiveLink(link.to)} />
          ))}
        </div>
        {/* Right Column */}
        <div className="flex items-center justify-center md:justify-end pt-14 md:pt-0">
          <ConnectWallet />
        </div>
      </div>
    </nav>
  );
};

export default Header;

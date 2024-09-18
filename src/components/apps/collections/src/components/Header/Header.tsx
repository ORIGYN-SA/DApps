import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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
    window.location.hash ? window.location.hash.slice(1) : '/'
  );

  useEffect(() => {
    const handleHashChange = () => {
      const newPath = window.location.hash ? window.location.hash.slice(1) : '/';
      setCurrentPath(newPath);
      console.log('Current Path:', newPath);
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
    <nav className="bg-white text-sm border-b border-mouse h-[90px] w-full flex flex-row items-center px-6">
      <div className="justify-center items-center flex-row flex w-full space-x-12">
        {links.map((link) => (
          <LinkItem key={link.to} link={link} isActive={isActiveLink(link.to)} />
        ))}
      </div>
      <button className="bg-black text-white font-semibold px-5 py-3 text-base rounded-full hover:scale-105 duration-100 transition-all">
        Connexion
      </button>
    </nav>
  );
};

export default Header;

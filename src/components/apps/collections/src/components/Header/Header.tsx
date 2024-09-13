import React from 'react';
import { useLocation } from 'react-router-dom';

interface Link {
  title: string;
  href: string;
}

const LinkItem: React.FC<{ link: Link; isActive: boolean }> = ({ link, isActive }) => {
  return (
    <a
      href={link.href}
      className={`items-center justify-around text-base font-semibold ${
        isActive
          ? 'text-black font-bold underline underline-offset-[37px]'
          : 'hover:underline hover:underline-offset-[37px]'
      }`}
    >
      {link.title}
    </a>
  );
};

const Header: React.FC = () => {
  const location = useLocation();

  const links: Link[] = [
    { title: 'Collections', href: '/' },
    { title: 'DAOs', href: '/daos' },
  ];

  return (
    <nav className="bg-white text-sm border-b border-mouse h-[90px] w-full flex flex-row items-center px-6">
      <div className="justify-center items-center flex-row flex w-full space-x-12">
        {links.map((link) => (
          <LinkItem key={link.href} link={link} isActive={location.pathname === link.href} />
        ))}
      </div>
      <button className="bg-black text-white font-semibold px-5 py-3 text-base rounded-full hover:scale-105 duration-100 transition-all">
        Connexion
      </button>
    </nav>
  );
};

export default Header;

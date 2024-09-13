import React from 'react';
import '../index.css';
import Header from './Header/Header';
import { Container } from '@origyn/origyn-art-ui';

const Home = () => {
  return (
    <div className="bg-[#FAFAFA] flex flex-col items-center w-full h-screen">
      <Header />
    </div>
  );
};

export default Home;

import React from 'react';
import '../index.css';
import Header from './Header/Header';
import Presentation from './Presentation/Presentation';
import CheckBoxBar from './Bar/CheckBoxBar';
import SearchSpecificCollectionBar from './Bar/SearchSpecificCollectionBar';

const Home = () => {
  return (
    <div className="bg-[#FAFAFA] flex flex-col items-center w-full h-screen">
      <Header />
      <Presentation />
      <div className="flex flex-row justify-between w-full px-[76px] space-x-12">
        <CheckBoxBar />
        <SearchSpecificCollectionBar />
      </div>
    </div>
  );
};

export default Home;

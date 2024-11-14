import React from 'react'
import { Link } from 'react-router-dom'

const fakeData = [
  {
    id: '1',
    name: 'The Midsummer Night Dream',
    collectionType: 'collection',
    holdersCount: 139,
    image: 'https://placehold.co/112x112',
  },
  {
    id: '2',
    name: 'The Starry Night Project',
    collectionType: 'collection',
    holdersCount: 256,
    image: 'https://placehold.co/112x112',
  },
  {
    id: '3',
    name: 'The Ancient Artifacts',
    collectionType: 'collection',
    holdersCount: 78,
    image: 'https://placehold.co/112x112',
  },
]

interface AvailableDAOsProps {
  isLoading: boolean
}

const AvailableDAOs = ({ isLoading }: AvailableDAOsProps) => (
  <section className='px-6 py-8 w-full md:w-3/4 mx-auto xl:w-full bg-white rounded-2xl shadow border border-[#e1e1e1] flex flex-col gap-8'>
    <header className='flex justify-between items-start'>
      <div>
        <h2 className="text-[#212425] text-[22px] font-semibold font-['DM Sans']">
          All DAOs available
        </h2>
        <p className="text-[#69737c] text-[13px] font-medium font-['DM Sans']">
          {fakeData.length} collections
        </p>
      </div>
    </header>
    <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {isLoading
        ? fakeData.map((_, index) => (
            <li key={index}>
              <DAOCardSkeleton />
            </li>
          ))
        : fakeData.map(dao => (
            <li key={dao.id}>
              <Link to={`/daos/${dao.id}/vote`} className='block'>
                <DAOCard
                  name={dao.name}
                  collectionType={dao.collectionType}
                  holdersCount={dao.holdersCount}
                  image={dao.image}
                />
              </Link>
            </li>
          ))}
    </ul>
  </section>
)

// Composant DAO individuel
const DAOCard = ({ name, collectionType, holdersCount, image }) => (
  <article className='h-32 p-2 w-fit bg-white md:pr-12 hover:bg-[#b7bbd51d] duration-200 transition-all rounded-2xl border border-[#e1e1e1] flex items-center gap-4'>
    <img className='w-28 h-28 rounded-2xl object-cover' src={image} alt={`${name} image`} />
    <div className='flex-1 flex flex-col justify-center gap-2'>
      <div className='flex items-center gap-0.5'>
        <span className='text-[#69737c] text-[10px] font-medium uppercase leading-[18px] tracking-widest'>
          {collectionType}
        </span>
      </div>
      <h3 className='text-[#212425] text-base font-bold'>{name}</h3>
      <span className='px-2 py-1 bg-[#212425] w-fit rounded-full text-white text-xs font-bold'>
        {holdersCount} NFTs holders
      </span>
    </div>
  </article>
)

// Skeleton pour une carte DAO
const DAOCardSkeleton = () => (
  <div className='h-32 p-2 bg-gray-200 md:pr-12 rounded-2xl border border-gray-300 animate-pulse flex items-center gap-4'>
    <div className='w-28 h-28 bg-gray-300 rounded-2xl' />
    <div className='flex-1 flex flex-col justify-center gap-2'>
      <div className='flex items-center gap-0.5'>
        <div className='w-20 h-4 bg-gray-300 rounded' />
      </div>
      <div className='w-48 h-6 bg-gray-300 rounded' />
      <div className='w-24 h-4 bg-gray-300 rounded-full' />
    </div>
  </div>
)

export default AvailableDAOs

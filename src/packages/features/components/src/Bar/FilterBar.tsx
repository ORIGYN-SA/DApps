import React, { useEffect, useRef, useState } from 'react'

interface FilterBarProps {
  setListedFilter: (status: 'all' | 'listed' | 'non-listed') => void
}

const FilterBar: React.FC<FilterBarProps> = ({ setListedFilter }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'listed' | 'non-listed'>('all')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = () => setIsOpen(prev => !prev)

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }

  const handleStatusChange = (status: 'all' | 'listed' | 'non-listed') => {
    setSelectedStatus(status)
    setListedFilter(status)
    setIsOpen(false)
  }

  const buttonText =
    selectedStatus === 'all'
      ? 'All statuses'
      : selectedStatus === 'listed'
      ? 'Listed only'
      : 'Non-listed only'

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className='relative w-full mx-auto' ref={dropdownRef}>
      <div
        onClick={toggleDropdown}
        className={`bg-white text-slate-700 font-semibold ${
          isOpen ? 'border-x border-t rounded-t-2xl' : 'border rounded-full'
        } border-gray-300 p-3 w-full cursor-pointer flex justify-between items-center`}
      >
        {buttonText}
        <span
          className={`transform font-semibold text-lg transition-transform ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'
            className='w-5 h-5'
          >
            <path
              fillRule='evenodd'
              d='M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z'
              clipRule='evenodd'
            />
          </svg>
        </span>
      </div>

      {isOpen && (
        <ul className='absolute z-10 w-full max-h-60 bg-white border-x border-b rounded-b-2xl border-gray-300 shadow-md overflow-y-auto'>
          <li
            onClick={() => handleStatusChange('all')}
            className='hover:bg-[#b7bbd51d] p-3 cursor-pointer'
          >
            <span className={selectedStatus === 'all' ? 'font-bold' : ''}>All statuses</span>
          </li>
          <li
            onClick={() => handleStatusChange('listed')}
            className='hover:bg-[#b7bbd51d] p-3 cursor-pointer'
          >
            <span className={selectedStatus === 'listed' ? 'font-bold' : ''}>Listed only</span>
          </li>
          <li
            onClick={() => handleStatusChange('non-listed')}
            className='hover:bg-[#b7bbd51d] p-3 cursor-pointer'
          >
            <span className={selectedStatus === 'non-listed' ? 'font-bold' : ''}>
              Non-listed only
            </span>
          </li>
        </ul>
      )}
    </div>
  )
}

export default FilterBar

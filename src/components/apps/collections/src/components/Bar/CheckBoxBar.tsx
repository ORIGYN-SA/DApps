import React, { useEffect, useRef, useState } from 'react';
import { CollectionType } from '../../types/global';

interface CheckboxBarProps {
  collections: CollectionType[];
  toggleCheckbox: (name: string) => void;
}

const CheckboxBar: React.FC<CheckboxBarProps> = ({ collections, toggleCheckbox }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedCount = collections.filter((item) => item.checked).length;
  const allChecked = selectedCount === collections.length;
  const buttonText = allChecked ? 'All collections' : `${selectedCount} collections selected`;
  const uniqueCollections = collections.filter(
    (item, index) =>
      collections.findIndex((t) => t.category_name === item.category_name) === index,
  );

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full mx-auto" ref={dropdownRef}>
      <div
        onClick={toggleDropdown}
        className={`bg-white text-slate-700 font-semibold ${
          isOpen ? 'border-x border-t rounded-t-2xl' : 'border rounded-full'
        } border-gray-300 p-3 w-full cursor-pointer flex justify-between items-center`}
      >
        {buttonText}
        <span className={`transform font-semibold text-lg transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path
              fillRule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </div>

      {isOpen && (
        <ul className="absolute z-10 w-full max-h-60 bg-white border-x border-b rounded-b-2xl border-gray-300 shadow-md overflow-y-auto">
          {uniqueCollections.map((item) => (
            <li key={item.category_name} className="hover:bg-[#b7bbd51d]">
              <label className="flex justify-between items-center p-3 text-slate-700 w-full cursor-pointer">
                <span>{item.category_name}</span>
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleCheckbox(item.category_name)}
                  className="hidden"
                />
                <span
                  className={`w-5 h-5 flex items-center justify-center border-2 rounded mr-3 ${
                    item.checked ? 'bg-mouse border-slate-500' : 'bg-mouse border-slate'
                  }`}
                >
                  {item.checked && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-black">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 5.707 8.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CheckboxBar;

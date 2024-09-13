import React, { useState } from 'react';

const collections = [
  { name: 'Art', checked: true },
  { name: 'Precious Metal', checked: true },
  { name: 'Diamond', checked: false },
  { name: 'Jewelry', checked: true },
  { name: 'Music', checked: false },
  { name: 'Real Estate', checked: true },
];

const CheckboxBar = () => {
  const [selectedItems, setSelectedItems] = useState(collections);
  const [isOpen, setIsOpen] = useState(false);

  const toggleCheckbox = (index: number) => {
    const updatedItems = [...selectedItems];
    updatedItems[index].checked = !updatedItems[index].checked;
    setSelectedItems(updatedItems);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative w-1/2">
      <div
        onClick={toggleDropdown}
        className={`bg-white text-slate-700 font-semibold ${
          isOpen ? 'border-x border-t rounded-t-2xl' : 'border rounded-full'
        } border-mouse p-3 w-full cursor-pointer flex justify-between items-center`}
      >
        All collections
        <span
          className={`transform font-semibold text-lg transition-transform ${
            isOpen ? '-rotate-90' : 'rotate-90'
          }`}
        >
          {'>'}
        </span>
      </div>

      {isOpen && (
        <ul className="absolute z-10 w-full bg-white border-x border-b rounded-b-2xl border-mouse shadow-md">
          {selectedItems.map((item, index) => (
            <li key={item.name} className="hover:bg-[#b7bbd51d] cursor-pointer"
            onClick={() => toggleCheckbox(index)}
            >
              <label className="flex justify-between items-center p-3 text-slate-700 w-full">
                <span>{item.name}</span>
                <input
                  type="checkbox"
                  checked={item.checked}
                  className="h-4 w-4 border border-slate-500 checked:text-black rounded-sm checked:bg-slate"
                />
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CheckboxBar;

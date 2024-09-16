import React, { useState, useRef, useEffect } from 'react';

interface Collection {
  name: string;
  checked: boolean;
}

const initialCollections: Collection[] = [
  { name: 'Art', checked: true },
  { name: 'Precious Metal', checked: true },
  { name: 'Diamond', checked: true },
  { name: 'Jewelry', checked: true },
  { name: 'Music', checked: true },
  { name: 'Real Estate', checked: true },
];

const CheckboxBar: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<Collection[]>(initialCollections);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fonction pour basculer l'état d'une checkbox
  const toggleCheckbox = (name: string) => {
    const updatedItems = selectedItems.map((item) =>
      item.name === name ? { ...item, checked: !item.checked } : item,
    );
    setSelectedItems(updatedItems);
  };

  // Fonction pour basculer l'ouverture du dropdown
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Calculer le nombre de collections sélectionnées
  const selectedCount = selectedItems.filter((item) => item.checked).length;
  const allChecked = selectedCount === selectedItems.length;

  // Texte du bouton principal
  const buttonText = allChecked ? 'All collections' : `${selectedCount} collections selected`;

  // Fonction pour fermer le dropdown lorsqu'on clique en dehors
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node;
    if (dropdownRef.current && !dropdownRef.current.contains(target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    // Ajouter un écouteur d'événement pour détecter les clics en dehors
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Nettoyer l'écouteur d'événement lors du démontage
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full  mx-auto" ref={dropdownRef}>
      {/* Bouton Dropdown */}
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
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </div>

      {isOpen && (
        <ul className="absolute z-10 w-full bg-white border-x border-b rounded-b-2xl border-gray-300 shadow-md overflow-y-auto">
          {selectedItems.map((item) => (
            <li key={item.name} className="hover:bg-[#b7bbd51d]">
              <label className="flex justify-between items-center p-3 text-slate-700 w-full cursor-pointer">
              <span>{item.name}</span>
                {/* Checkbox native cachée */}
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleCheckbox(item.name)}
                  className="hidden"
                />
                {/* Checkbox personnalisée */}
                <span
                  className={`w-5 h-5 flex items-center justify-center border-2 rounded mr-3 ${
                    item.checked ? 'bg-mouse border-slate-500 border-2' : 'bg-mouse border-slate border-2'
                  }`}
                >
                  {item.checked && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 text-black"
                    >
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

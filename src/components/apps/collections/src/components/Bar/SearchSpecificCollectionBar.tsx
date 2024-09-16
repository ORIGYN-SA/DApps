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
  // Ajoutez d'autres collections si nécessaire
];

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredItems, setFilteredItems] = useState<Collection[]>(initialCollections);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fonction pour gérer les changements dans la barre de recherche
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsOpen(true);
  };

  // Fonction pour filtrer les collections avec debounce
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      const filtered = initialCollections.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredItems(filtered);
    }, 300); // Délai de 300ms

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchTerm]);

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

  // Fonction pour gérer la sélection d'un item
  const handleItemClick = (item: Collection) => {
    setSearchTerm(item.name);
    setIsOpen(false);
    triggerFetch(item.name);
  };

  // Fonction pour déclencher un fetch (à adapter selon vos besoins)
  const triggerFetch = (collectionName: string) => {
    // Exemple de fetch (remplacez l'URL par votre propre endpoint)
    fetch(`https://api.example.com/collections/${collectionName}`)
      .then(response => response.json())
      .then(data => {
        console.log('Fetched data:', data);
        // Traitez les données récupérées selon vos besoins
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  // Fonction pour réinitialiser l'input lors du focus
  const handleFocus = () => {
    if (initialCollections.some(item => item.name === searchTerm)) {
      setSearchTerm('');
    }
    setIsOpen(true);
  };

  return (
    <div className="relative w-full mx-auto" ref={dropdownRef}>
      {/* Barre de Recherche */}
      <div
        className={`bg-white text-slate-700 font-semibold ${
          isOpen ? 'border-x border-t rounded-t-2xl' : 'border rounded-full'
        } border-gray-300 p-3 w-full flex items-center`}
      >
        <input
          type="text"
          placeholder="Search for a specific collection"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={handleFocus}
          className="flex-grow outline-none bg-transparent"
        />
        {/* Icône de loupe */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5 text-gray-500 cursor-pointer"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {/* Dropdown avec les résultats de recherche */}
      {isOpen && (
        <ul className="absolute z-10 w-full bg-white border-x border-b rounded-b-2xl border-gray-300 shadow-md max-h-60 overflow-y-auto">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <li
                key={item.name}
                className="hover:bg-slate-200"
                onClick={() => handleItemClick(item)}
              >
                <div className="flex items-center p-3 cursor-pointer">
                  <span>{item.name}</span>
                </div>
              </li>
            ))
          ) : (
            <li className="p-3 text-gray-500">No collections found.</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;

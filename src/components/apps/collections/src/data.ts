// src/data.ts

export interface Collection {
  name: string;
  checked: boolean;
  image: string;
  creator: string;
  nftCount: number;
}

export interface BackendResponse {
  collections: Collection[];
  totalPages: number;
}

export const fetchCollectionsFromBackend = async (
  page: number,
  limit: number,
): Promise<BackendResponse> => {
  // Simulate more data for pagination
  const allCollections: Collection[] = [
    {
      name: 'Art',
      checked: true,
      image: 'https://via.placeholder.com/150',
      creator: 'Alice',
      nftCount: 120,
    },
    {
      name: 'Precious Metal',
      checked: true,
      image: 'https://via.placeholder.com/150',
      creator: 'Bob',
      nftCount: 85,
    },
    {
      name: 'Diamond',
      checked: true,
      image: 'https://via.placeholder.com/150',
      creator: 'Charlie',
      nftCount: 200,
    },
    {
      name: 'Jewelry',
      checked: true,
      image: 'https://via.placeholder.com/150',
      creator: 'Diana',
      nftCount: 150,
    },
    {
      name: 'Music',
      checked: true,
      image: 'https://via.placeholder.com/150',
      creator: 'Ethan',
      nftCount: 95,
    },
    {
      name: 'Real Estate',
      checked: true,
      image: 'https://via.placeholder.com/150',
      creator: 'Fiona',
      nftCount: 60,
    },
    {
      name: 'Photography',
      checked: true,
      image: 'https://via.placeholder.com/150',
      creator: 'Grace',
      nftCount: 110,
    },
    {
      name: 'Vintage Cars',
      checked: true,
      image: 'https://via.placeholder.com/150',
      creator: 'Henry',
      nftCount: 75,
    },
    {
      name: 'Antiques',
      checked: true,
      image: 'https://via.placeholder.com/150',
      creator: 'Irene',
      nftCount: 50,
    },
    {
      name: 'Collectible Coins',
      checked: true,
      image: 'https://via.placeholder.com/150',
      creator: 'Jack',
      nftCount: 130,
    },
    // Add more collections to have enough data for pagination
    {
      name: 'Sculptures',
      checked: true,
      image: 'https://via.placeholder.com/150',
      creator: 'Leo',
      nftCount: 90,
    },
    {
      name: 'Books',
      checked: true,
      image: 'https://via.placeholder.com/150',
      creator: 'Mia',
      nftCount: 65,
    },
    {
      name: 'Virtual Real Estate',
      checked: true,
      image: 'https://via.placeholder.com/150',
      creator: 'Nolan',
      nftCount: 80,
    },
    {
      name: 'Sports Memorabilia',
      checked: true,
      image: 'https://via.placeholder.com/150',
      creator: 'Olivia',
      nftCount: 115,
    },
    {
      name: 'Watches',
      checked: true,
      image: 'https://via.placeholder.com/150',
      creator: 'Peter',
      nftCount: 55,
    },
    {
      name: 'Wine Collection',
      checked: true,
      image: 'https://via.placeholder.com/150',
      creator: 'Quincy',
      nftCount: 70,
    },
    {
      name: 'Fashion',
      checked: true,
      image: 'https://via.placeholder.com/150',
      creator: 'Rachel',
      nftCount: 125,
    },
    {
      name: 'Handicrafts',
      checked: true,
      image: 'https://via.placeholder.com/150',
      creator: 'Sam',
      nftCount: 100,
    },
    {
      name: 'Rare Stamps',
      checked: true,
      image: 'https://via.placeholder.com/150',
      creator: 'Tina',
      nftCount: 40,
    },
    {
      name: 'Ceramics',
      checked: true,
      image: 'https://via.placeholder.com/150',
      creator: 'Uma',
      nftCount: 85,
    },
    {
      name: 'Modern Art',
      checked: true,
      image: 'https://via.placeholder.com/150',
      creator: 'Victor',
      nftCount: 95,
    },
    {
      name: 'Classic Cars',
      checked: true,
      image: 'https://via.placeholder.com/150',
      creator: 'Wendy',
      nftCount: 60,
    },
    {
      name: 'Historical Documents',
      checked: true,
      image: 'https://via.placeholder.com/150',
      creator: 'Xavier',
      nftCount: 30,
    },
    {
      name: 'Comics',
      checked: true,
      image: 'https://via.placeholder.com/150',
      creator: 'Zach',
      nftCount: 110,
    },
  ];

  const startIndex = (page - 1) * limit;
  const paginatedCollections = allCollections.slice(startIndex, startIndex + limit);
  const totalPages = Math.ceil(allCollections.length / limit);

  return {
    collections: paginatedCollections,
    totalPages,
  };
};

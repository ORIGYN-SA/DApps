// src/data.ts

interface Collection {
  name: string;
  checked: boolean;
  image: string;
  category_id: string;
  nftCount: number;
}

interface BackendResponse {
  collections: Collection[];
  totalPages: number;
}

const fetchCollectionsFromBackend = async (
  page: number,
  limit: number,
): Promise<BackendResponse> => {
  // Simulate more data for pagination
  const allCollections: Collection[] = [
    {
      name: 'Art',
      checked: true,
      image: 'https://via.placeholder.com/150',
      category_id: 'Alice',
      nftCount: 120,
    },
    {
      name: 'Precious Metal',
      checked: true,
      image: 'https://via.placeholder.com/150',
      category_id: 'Bob',
      nftCount: 85,
    },
    {
      name: 'Diamond',
      checked: true,
      image: 'https://via.placeholder.com/150',
      category_id: 'Charlie',
      nftCount: 200,
    },
    {
      name: 'Jewelry',
      checked: true,
      image: 'https://via.placeholder.com/150',
      category_id: 'Diana',
      nftCount: 150,
    },
    {
      name: 'Music',
      checked: true,
      image: 'https://via.placeholder.com/150',
      category_id: 'Ethan',
      nftCount: 95,
    },
    {
      name: 'Real Estate',
      checked: true,
      image: 'https://via.placeholder.com/150',
      category_id: 'Fiona',
      nftCount: 60,
    },
    {
      name: 'Photography',
      checked: true,
      image: 'https://via.placeholder.com/150',
      category_id: 'Grace',
      nftCount: 110,
    },
    {
      name: 'Vintage Cars',
      checked: true,
      image: 'https://via.placeholder.com/150',
      category_id: 'Henry',
      nftCount: 75,
    },
    {
      name: 'Antiques',
      checked: true,
      image: 'https://via.placeholder.com/150',
      category_id: 'Irene',
      nftCount: 50,
    },
    {
      name: 'Collectible Coins',
      checked: true,
      image: 'https://via.placeholder.com/150',
      category_id: 'Jack',
      nftCount: 130,
    },
    // Add more collections to have enough data for pagination
    {
      name: 'Sculptures',
      checked: true,
      image: 'https://via.placeholder.com/150',
      category_id: 'Leo',
      nftCount: 90,
    },
    {
      name: 'Books',
      checked: true,
      image: 'https://via.placeholder.com/150',
      category_id: 'Mia',
      nftCount: 65,
    },
    {
      name: 'Virtual Real Estate',
      checked: true,
      image: 'https://via.placeholder.com/150',
      category_id: 'Nolan',
      nftCount: 80,
    },
    {
      name: 'Sports Memorabilia',
      checked: true,
      image: 'https://via.placeholder.com/150',
      category_id: 'Olivia',
      nftCount: 115,
    },
    {
      name: 'Watches',
      checked: true,
      image: 'https://via.placeholder.com/150',
      category_id: 'Peter',
      nftCount: 55,
    },
    {
      name: 'Wine Collection',
      checked: true,
      image: 'https://via.placeholder.com/150',
      category_id: 'Quincy',
      nftCount: 70,
    },
    {
      name: 'Fashion',
      checked: true,
      image: 'https://via.placeholder.com/150',
      category_id: 'Rachel',
      nftCount: 125,
    },
    {
      name: 'Handicrafts',
      checked: true,
      image: 'https://via.placeholder.com/150',
      category_id: 'Sam',
      nftCount: 100,
    },
    {
      name: 'Rare Stamps',
      checked: true,
      image: 'https://via.placeholder.com/150',
      category_id: 'Tina',
      nftCount: 40,
    },
    {
      name: 'Ceramics',
      checked: true,
      image: 'https://via.placeholder.com/150',
      category_id: 'Uma',
      nftCount: 85,
    },
    {
      name: 'Modern Art',
      checked: true,
      image: 'https://via.placeholder.com/150',
      category_id: 'Victor',
      nftCount: 95,
    },
    {
      name: 'Classic Cars',
      checked: true,
      image: 'https://via.placeholder.com/150',
      category_id: 'Wendy',
      nftCount: 60,
    },
    {
      name: 'Historical Documents',
      checked: true,
      image: 'https://via.placeholder.com/150',
      category_id: 'Xavier',
      nftCount: 30,
    },
    {
      name: 'Comics',
      checked: true,
      image: 'https://via.placeholder.com/150',
      category_id: 'Zach',
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

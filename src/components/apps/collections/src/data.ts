// src/data.ts
interface Collection {
  name: string;
  checked: boolean;
  image: string;
  category_id: string;
  nftCount: number;
}

interface NFT {
  id: string;
  name: string;
  collectionName: string;
  image: string;
  subtitle: string;
  price: string;
}

interface BackendResponse {
  collections: Collection[];
  totalPages: number;
}

interface NFTResponse {
  nfts: NFT[];
  totalPages: number;
}

export const fetchFakeCollections = async (
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

export const fetchFakeNFTs = async (page: number, limit: number): Promise<NFTResponse> => {
  // Simule les données des NFTs
  const allNFT: NFT[] = [
    {
      id: 'nft-1',
      name: 'Arctic Ice Bracelet',
      collectionName: 'Jewelry',
      image: 'https://via.placeholder.com/243x244',
      subtitle: 'A unique piece of art',
      price: '12 OGY',
    },
    {
      id: 'nft-2',
      name: 'The Midsummer Night Dream',
      collectionName: 'Art',
      image: 'https://via.placeholder.com/243x244',
      subtitle: 'Inspired by Shakespeare',
      price: '556.76 ICP',
    },
    {
      id: 'nft-3',
      name: 'Magellanic Cloud Bracelet',
      collectionName: 'Precious Metal',
      image: 'https://via.placeholder.com/243x244',
      subtitle: 'Cosmic beauty captured',
      price: '30 OGY',
    },
    {
      id: 'nft-4',
      name: 'Star Wars Treasures Ring',
      collectionName: 'Collectible Coins',
      image: 'https://via.placeholder.com/243x244',
      subtitle: 'A galactic accessory',
      price: '75 OGY',
    },
    {
      id: 'nft-5',
      name: 'Snow White Necklace',
      collectionName: 'Antiques',
      image: 'https://via.placeholder.com/243x244',
      subtitle: 'Timeless elegance',
      price: '50 OGY',
    },
    {
      id: 'nft-6',
      name: 'Belle Epoque Earrings',
      collectionName: 'Vintage Cars',
      image: 'https://via.placeholder.com/243x244',
      subtitle: 'Classic charm',
      price: '60 OGY',
    },
    {
      id: 'nft-7',
      name: 'Picture Perfect Ring',
      collectionName: 'Photography',
      image: 'https://via.placeholder.com/243x244',
      subtitle: 'Capturing moments',
      price: '45 OGY',
    },
    {
      id: 'nft-8',
      name: 'La Preziosa Ring',
      collectionName: 'Diamond',
      image: 'https://via.placeholder.com/243x244',
      subtitle: 'Pure brilliance',
      price: '120 OGY',
    },
    {
      id: 'nft-9',
      name: 'Moon and Sun Fun Ring',
      collectionName: 'Jewelry',
      image: 'https://via.placeholder.com/243x244',
      subtitle: 'Celestial harmony',
      price: '85 OGY',
    },
    {
      id: 'nft-10',
      name: 'Vintage Car Model T',
      collectionName: 'Vintage Cars',
      image: 'https://via.placeholder.com/243x244',
      subtitle: 'An antique masterpiece',
      price: '150 OGY',
    },
    {
      id: 'nft-11',
      name: 'Rare Stamp 1840 Penny Black',
      collectionName: 'Rare Stamps',
      image: 'https://via.placeholder.com/243x244',
      subtitle: 'First adhesive postage stamp',
      price: '200 OGY',
    },
    {
      id: 'nft-12',
      name: 'Golden Wine Bottle',
      collectionName: 'Wine Collection',
      image: 'https://via.placeholder.com/243x244',
      subtitle: 'Aged to perfection',
      price: '95 OGY',
    },
    {
      id: 'nft-13',
      name: 'Handcrafted Ceramic Vase',
      collectionName: 'Ceramics',
      image: 'https://via.placeholder.com/243x244',
      subtitle: 'Artisan craftsmanship',
      price: '40 OGY',
    },
    {
      id: 'nft-14',
      name: 'Modern Art Piece',
      collectionName: 'Modern Art',
      image: 'https://via.placeholder.com/243x244',
      subtitle: 'Abstract expressionism',
      price: '110 OGY',
    },
    {
      id: 'nft-15',
      name: 'Classic Comic Book',
      collectionName: 'Comics',
      image: 'https://via.placeholder.com/243x244',
      subtitle: 'First edition superhero',
      price: '70 OGY',
    },
    {
      id: 'nft-16',
      name: 'Historical Document',
      collectionName: 'Historical Documents',
      image: 'https://via.placeholder.com/243x244',
      subtitle: 'Signed by a famous figure',
      price: '250 OGY',
    },
    {
      id: 'nft-17',
      name: 'Vintage Watch',
      collectionName: 'Watches',
      image: 'https://via.placeholder.com/243x244',
      subtitle: 'Timeless precision',
      price: '80 OGY',
    },
    {
      id: 'nft-18',
      name: 'Digital Real Estate Plot',
      collectionName: 'Virtual Real Estate',
      image: 'https://via.placeholder.com/243x244',
      subtitle: 'Own a piece of the metaverse',
      price: '300 OGY',
    },
    {
      id: 'nft-19',
      name: 'Sculpture of Liberty',
      collectionName: 'Sculptures',
      image: 'https://via.placeholder.com/243x244',
      subtitle: 'Symbol of freedom',
      price: '130 OGY',
    },
    {
      id: 'nft-20',
      name: 'Handmade Leather Bag',
      collectionName: 'Fashion',
      image: 'https://via.placeholder.com/243x244',
      subtitle: 'Elegance in every stitch',
      price: '65 OGY',
    },
    // Ajoutez plus de NFTs si nécessaire
  ];

  const startIndex = (page - 1) * limit;
  const paginatedNFTs = allNFT.slice(startIndex, startIndex + limit);
  const totalPages = Math.ceil(allNFT.length / limit);

  return {
    nfts: paginatedNFTs,
    totalPages,
  };
};

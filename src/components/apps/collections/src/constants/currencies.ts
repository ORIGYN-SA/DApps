// src/constants/currencies.ts

export interface Currency {
  code: string;
  name: string;
  icon: string;
  isUsable: boolean;
  canisterId: string;
  decimals: number;
}

export const currencies: Currency[] = [
  {
    code: 'OGY',
    name: 'OGY',
    icon: '/assets/OGY_Icon.svg',
    isUsable: true,
    canisterId: 'j5naj-nqaaa-aaaal-ajc7q-cai',
    decimals: 8,
  },
  {
    code: 'ICP',
    name: 'ICP',
    icon: '/assets/IC_Icon.svg',
    isUsable: true,
    canisterId: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
    decimals: 8,
  },
  {
    code: 'ckUSDC',
    name: 'ckUSDC',
    icon: '/assets/ckUSDC.webp',
    isUsable: true,
    canisterId: 'xevnm-gaaaa-aaaar-qafnq-cai',
    decimals: 8,
  },
  // add more currencies as needed
  // warning: max character currency name length to not break the layout is 6 characters.
];

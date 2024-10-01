// src/constants/currencies.ts

export interface Currency {
  code: string;
  name: string;
  icon: string;
  coingeckoId: string;
}

export const currencies: Currency[] = [
  {
    code: 'OGY',
    name: 'OGY',
    icon: '/assets/OGY_Icon.svg',
    coingeckoId: 'origyn-foundation',
  },
  {
    code: 'ICP',
    name: 'ICP',
    icon: '/assets/IC_Icon.svg',
    coingeckoId: 'internet-computer',
  },
  // add more currencies as needed
];

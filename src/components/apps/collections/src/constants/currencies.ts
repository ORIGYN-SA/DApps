// src/constants/currencies.ts

export interface Currency {
  code: string;
  name: string;
  icon: string;
  isUsable: boolean;
}

export const currencies: Currency[] = [
  {
    code: 'OGY',
    name: 'OGY',
    icon: '/assets/OGY_Icon.svg',
    isUsable: true,
  },
  {
    code: 'ICP',
    name: 'ICP',
    icon: '/assets/IC_Icon.svg',
    isUsable: true,
  },
  {
    code: 'ckUSDC',
    name: 'ckUSDC',
    icon: '/assets/ckUSDC.webp',
    isUsable: true,
  },
  // add more currencies as needed
  // warning: max character currency name length to not break the layout is 6 characters.
];

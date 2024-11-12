import {
  CKUSDC_LEDGER_CANISTER_ID,
  GLDT_LEDGER_CANISTER_ID,
  ICP_LEDGER_CANISTER_ID,
  OGY_LEDGER_CANISTER_ID,
} from './environnement'

export interface Currency {
  code: string
  name: string
  icon: string
  isUsable: boolean
  canisterId: string
  decimals: number
}

export const currencies: Currency[] = [
  {
    code: 'OGY',
    name: 'OGY',
    icon: '/assets/OGY_Icon.svg',
    isUsable: true,
    canisterId: OGY_LEDGER_CANISTER_ID || '',
    decimals: 8,
  },
  {
    code: 'ICP',
    name: 'ICP',
    icon: '/assets/IC_Icon.svg',
    isUsable: true,
    canisterId: ICP_LEDGER_CANISTER_ID || '',
    decimals: 8,
  },
  {
    code: 'ckUSDC',
    name: 'ckUSDC',
    icon: '/assets/ckUSDC.webp',
    isUsable: true,
    canisterId: CKUSDC_LEDGER_CANISTER_ID || '',
    decimals: 8,
  },
  {
    code: 'GLDT',
    name: 'Gold Token',
    icon: '/assets/GLDT_Icon.svg',
    isUsable: false,
    canisterId: GLDT_LEDGER_CANISTER_ID || '',
    decimals: 8,
  },
  // add more currencies as needed
  // warning: max character currency name length to not break the layout is 6 characters.
]

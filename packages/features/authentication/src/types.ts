import { Provider } from '@connect2ic/core';
import { Principal } from '@dfinity/principal';

export type AuthContextType = {
  activeWalletProvider?: Provider;
  actor?: any;
  canisterId?: string;
  handleLogOut?: () => void;
  isLoading: boolean;
  localDevelopment?: boolean;
  loggedIn: boolean;
  principal?: Principal;
  setLocalDevelopment?: (value: boolean) => void;
  tokenId?: string;
};

https://sp3hj-caaaa-aaaaa-aaajq-cai.localhost:8000/-/bm-0/preview
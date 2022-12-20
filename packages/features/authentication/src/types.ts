import { Provider } from '@connect2ic/core';
import { Principal } from '@dfinity/principal';

export type AuthContextType = {
  activeWalletProvider?: Provider;
  actor?: any;
  handleLogOut?: () => void;
  isLoading: boolean;
  loggedIn: boolean;
  principal?: Principal;
  setLocalDevelopment?: (value: boolean) => void;
};
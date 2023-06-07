import { Provider } from '@connect2ic/core';
import { Principal } from '@dfinity/principal';
import { OrigynNftActor } from '@origyn/mintjs';

export type AuthContextType = {
  activeWalletProvider?: Provider;
  actor?: OrigynNftActor;
  handleLogOut?: () => void;
  isLoading: boolean;
  loggedIn: boolean;
  principal?: Principal;
  principalId: string;
};

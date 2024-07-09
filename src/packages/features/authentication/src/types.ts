import type { Provider } from '@connect2ic/core';
import { Principal } from '@dfinity/principal';
import type { OrigynNftActor } from '@origyn/mintjs';

export type AuthContextType = {
  activeWalletProvider?: Provider;
  actor?: OrigynNftActor;
  handleLogOut?: () => void;
  isLoading: boolean;
  loggedIn: boolean;
  principal?: Principal;
  principalId: string;
};

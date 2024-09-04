import type { Provider } from '@connect2ic/core';
import { Principal } from '@dfinity/principal';
// @ts-ignore
import type { _SERVICE } from '@dapp/common-candid'; // export default service
import { ActorSubclass } from '@dfinity/agent';

export type AuthContextType = {
  activeWalletProvider?: Provider;
  actor?: ActorSubclass<_SERVICE>;
  handleLogOut?: () => void;
  isLoading: boolean;
  loggedIn: boolean;
  principal?: Principal;
  principalId: string;
};

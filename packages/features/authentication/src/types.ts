import { Principal } from '@dfinity/principal';

export type AuthContextType = {
  isLoading: boolean;
  loggedIn: boolean;
  isAuthorized?: boolean;
  tokenId?: string;
  canisterId?: string;
  principal?: Principal;
  actor?: any;
  ogyActor?: any;
  handleLogOut?: () => void;
};

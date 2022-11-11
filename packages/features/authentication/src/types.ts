import { Principal } from '@dfinity/principal';

export type AuthContextType = {
  actor?: any;
  canisterId?: string;
  handleLogOut?: () => void;
  isAuthorized?: boolean;
  isLoading: boolean;
  localDevelopment?: boolean;
  loggedIn: boolean;
  ogyActor?: any;
  principal?: Principal;
  setLocalDevelopment?: (value: boolean) => void;
  tokenId?: string;
};

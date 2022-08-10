import { StoicIdentity } from 'ic-stoic-identity';
import { useContext } from 'react';
import { AuthContext } from './index';

const useStoic = () => {
  const { principal } = useContext(AuthContext);
  const connectStoic = async () => {
    let identity = await StoicIdentity.load();
    if (identity === false) {
      identity = await StoicIdentity.connect();
    }

    window.localStorage.setItem('loggedIn', 'stoic');
    const accounts = JSON.parse(await identity.accounts());
    return {
      principal: identity.getPrincipal(),
      accounts,
    };
  };
  return connectStoic;
};

export default useStoic;

import { StoicIdentity } from "ic-stoic-identity";

const useStoic = () => {
  const connectStoic = async () => {
    let identity = await StoicIdentity.load();
    if (identity === false) {
      identity = await StoicIdentity.connect();
    }

    window.localStorage.setItem("loggedIn", "stoic");
    const accounts = JSON.parse(await identity.accounts());
    return {
      principal: identity.getPrincipal(),
      accounts,
    };
  };
  return connectStoic;
};

export default useStoic;

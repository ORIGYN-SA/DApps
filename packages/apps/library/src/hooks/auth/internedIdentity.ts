import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../candid/origyn_nft_reference.did";
import { getCanisterId } from "./getRoute";

const useInternetIdentity = () => {
  const connectInternetIdentity = async () => {
    const authClient = await AuthClient.create();
    const canisterId = await getCanisterId();
    console.log(authClient);
    if (await authClient.isAuthenticated()) {
      console.log("already authenticated ii");

      // const actor = await getIdentityActor(authClient);
      const identity = authClient.getIdentity();
      const principal = identity.getPrincipal();

      const airdropAgent = new HttpAgent({
        identity,
        host: "https://boundary.ic0.app/",
      });

      const actor = Actor.createActor(idlFactory, {
        agent: airdropAgent,
        canisterId: canisterId!,
      });
      window.localStorage.setItem("loggedIn", "ii");
      return {
        authorized: true,
        identity,
        principal,
        actor,
      };
    } else {
      console.log("new login ii");
      await authClient.login({
        identityProvider: "https://identity.ic0.app/#authorize",
        onSuccess: async () => {
          const identity = authClient.getIdentity();
          const principal = identity.getPrincipal();
          console.log("onSuccess", identity, principal);
          window.localStorage.setItem("loggedIn", "ii");
          window.location.reload();
        },
      });
      return {
        authorized: false,
      };
    }
  };
  return connectInternetIdentity;
};

export default useInternetIdentity;

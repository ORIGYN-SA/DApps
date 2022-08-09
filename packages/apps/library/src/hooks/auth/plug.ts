import { idlFactory } from "../../../candid/origyn_nft_reference.did";
import { idlFactory as idlLedger } from "../../../candid/ledger.did";
import { getCanisterId, getTokenId } from "./getRoute";
const OGY_LEDGER_CANSITER = "jwcfb-hyaaa-aaaaj-aac4q-cai";
const usePlug = () => {
  const connectPlug = async () => {
    const canisterId = await getCanisterId();
    const tokenId = getTokenId();

    if (!(await window.ic.plug.isConnected())) {
      const connected = await window.ic.plug.requestConnect({
        whitelist: [canisterId, OGY_LEDGER_CANSITER],
      });
      if (connected === "denied")
        throw new Error("Error with plug.requestConnect");
    }

    await window.ic.plug.createAgent({
      whitelist: [canisterId, OGY_LEDGER_CANSITER],
      host: "https://boundary.ic0.app",
    });

    const actor = await window.ic.plug.createActor({
      canisterId: canisterId,
      interfaceFactory: idlFactory,
    });

    const ogyActor = await window.ic.plug.createActor({
      canisterId: OGY_LEDGER_CANSITER,
      interfaceFactory: idlLedger,
    });

    const plugPrincipal = await window.ic.plug.agent.getPrincipal();
    window.localStorage.setItem("loggedIn", "plug");

    return {
      principal: plugPrincipal,
      canisterId,
      tokenId,
      actor,
      ogyActor,
    };
  };

  return connectPlug;
};

export default usePlug;

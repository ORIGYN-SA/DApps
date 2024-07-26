import { getActor } from "@origyn/actor-reference";
import { IdlStandard, getIdl } from "@dapp/utils";
import type { Token } from "./TokensContextProvider";

type MetadataReponse = {
  decimals: number;
  fee: number;
  icon?: string;
  symbol: string;
};

const getTokenActor = async (
  isLocal: boolean,
  token: Token,
  idlStandard: IdlStandard
) => {
  const actor = await getActor<any>({
    canisterId: token.canisterId,
    idlFactory: getIdl(idlStandard),
    isLocal,
  });

  return actor;
};

const dip20Method = async (
  isLocal: boolean,
  token: Token
): Promise<MetadataReponse> => {
  const actor = await getTokenActor(isLocal, token, IdlStandard.DIP20);

  const metadataResult: any = await actor.getMetadata();

  return {
    decimals: metadataResult.decimals,
    fee: metadataResult.fee,
    icon: metadataResult.logo,
    symbol: metadataResult.symbol,
  };
};

const extMethod = async (
  isLocal: boolean,
  token: Token
): Promise<MetadataReponse> => {
  const actor = await getTokenActor(isLocal, token, IdlStandard.EXT);

  const extensions: any = await actor.extensions();

  if (!extensions.includes("@ext/common")) {
    throw new Error(
      "The provided canister does not implement commont extension"
    );
  }

  const metadataResult: any = await actor.metadata(token.symbol);

  if ("ok" in metadataResult) {
    return metadataResult.ok;
  }

  throw new Error(Object.keys(metadataResult.err)[0]);
};

const xtcMethod = async (
  isLocal: boolean,
  token: Token
): Promise<MetadataReponse> => {
  const actor = await getTokenActor(isLocal, token, IdlStandard.XTC);

  const metadataResult: any = await actor.getMetadata();

  return {
    decimals: metadataResult.decimals,
    fee: metadataResult.fee,
    icon: metadataResult.icon,
    symbol: metadataResult.symbol,
  };
};

const wicpMethod = async (
  isLocal: boolean,
  token: Token
): Promise<MetadataReponse> => {
  const actor = await getTokenActor(isLocal, token, IdlStandard.WICP);

  const metadataResult: any = await actor.getMetadata();

  return {
    decimals: metadataResult.decimals,
    fee: metadataResult.fee,
    icon: metadataResult.logo,
    symbol: metadataResult.symbol,
  };
};

export const getMetadata = async (
  isLocal: boolean,
  canisterId: string,
  standard: IdlStandard
) => {
  const token: Token = {
    canisterId,
    standard,
    symbol: "",
  };
  switch (standard) {
    case IdlStandard.DIP20:
      return dip20Method(isLocal, token);
    case IdlStandard.EXT:
      return extMethod(isLocal, token);
    case IdlStandard.WICP:
      return wicpMethod(isLocal, token);
    case IdlStandard.XTC:
      return xtcMethod(isLocal, token);
  }
};

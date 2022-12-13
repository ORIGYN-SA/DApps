import { Actor, HttpAgent } from '@dfinity/agent';
import { IdlStandard, getIdl } from '@dapp/utils';
import { Token } from './TokensContextProvider';

type MetadataReponse = {
  decimals: number;
  fee: number;
  icon?: string;
  symbol: string;
};

const createAgent = (isLocal: boolean) =>
  new HttpAgent({
    host: isLocal ? 'http://localhost:8000' : 'https://boundary.ic0.app/',
  });

const dip20Method = async (isLocal: boolean, token: Token): Promise<MetadataReponse> => {
  const actor = Actor.createActor(getIdl(IdlStandard.DIP20), {
    canisterId: isLocal ? token.localCanisterId : token.canisterId,
    agent: createAgent(isLocal),
  });
  const metadataResult: any = await actor.getMetadata();
  return {
    decimals: metadataResult.decimals,
    fee: metadataResult.fee,
    icon: metadataResult.logo,
    symbol: metadataResult.symbol,
  };
};

const extMethod = async (isLocal: boolean, token: Token): Promise<MetadataReponse> => {
  const actor = Actor.createActor(getIdl(IdlStandard.EXT), {
    canisterId: isLocal ? token.localCanisterId : token.canisterId,
    agent: createAgent(isLocal),
  });
  const extensions: any = await actor.extensions();
  if (!extensions.includes('@ext/common'))
    throw new Error('The provided canister does not implement commont extension');
  const metadataResult: any = await actor.metadata(token.symbol);

  if ('ok' in metadataResult) {
    console.log('🚀 ~ file: getMetadata.ts ~ line 45 ~ metadataResult', metadataResult);
    return metadataResult.ok;
  }

  throw new Error(Object.keys(metadataResult.err)[0]);
};

const xtcMethod = async (isLocal: boolean, token: Token): Promise<MetadataReponse> => {
  const actor = Actor.createActor(getIdl(IdlStandard.XTC), {
    canisterId: isLocal ? token.localCanisterId : token.canisterId,
    agent: createAgent(isLocal),
  });
  const metadataResult: any = await actor.getMetadata();
  return {
    decimals: metadataResult.decimals,
    fee: metadataResult.fee,
    icon: metadataResult.icon,
    symbol: metadataResult.symbol,
  };
};

const wicpMethod = async (isLocal: boolean, token: Token): Promise<MetadataReponse> => {
  const actor = Actor.createActor(getIdl(IdlStandard.WICP), {
    canisterId: isLocal ? token.localCanisterId : token.canisterId,
    agent: createAgent(isLocal),
  });
  const metadataResult: any = await actor.getMetadata();
  return {
    decimals: metadataResult.decimals,
    fee: metadataResult.fee,
    icon: metadataResult.logo,
    symbol: metadataResult.symbol,
  };
};

export const getMetadata = async (isLocal: boolean, canisterId: string, standard: IdlStandard) => {
  const token: Token = {
    canisterId,
    standard,
    symbol: '',
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

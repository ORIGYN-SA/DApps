import { IdlStandard } from '@dapp/utils';
import { Principal } from '@dfinity/principal';
import JSONBig from 'json-bigint';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getBalance as getBalanceFromCanister } from './getBalance';
import { getMetadata } from './getMetadata';
import { timeConverter } from '@dapp/utils';

const defaultTokens = {
  ICP: {
    symbol: 'ICP',
    canisterId: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
    fee: 10000,
    standard: IdlStandard.ICP,
    decimals: 8,
    enabled: true,
    balance: -1,
  },
  OGY: {
    symbol: 'OGY',
    canisterId: 'jwcfb-hyaaa-aaaaj-aac4q-cai',
    fee: 200000,
    standard: IdlStandard.ICP,
    decimals: 8,
    enabled: true,
    balance: -1,
  },
  XTC: {
    symbol: 'XTC',
    canisterId: 'aanaa-xaaaa-aaaah-aaeiq-cai',
    fee: 200000,
    standard: IdlStandard.DIP20,
    icon: 'https://storageapi.fleek.co/fleek-team-bucket/Dank/XTC-DAB.png',
    enabled: false,
    balance: -1,
  },
  WICP: {
    symbol: 'WICP',
    canisterId: 'utozz-siaaa-aaaam-qaaxq-cai',
    fee: 200000,
    standard: IdlStandard.WICP,
    icon: 'https://storageapi.fleek.co/fleek-team-bucket/logos/wicp-logo.png',
    enabled: false,
  },
};

export type Token = {
  balance?: number;
  localCanisterId?: string;
  canisterId: string;
  decimals?: number;
  enabled?: boolean;
  fee?: number;
  icon?: any;
  standard: IdlStandard;
  symbol: string;
};

export const AddTokenError = {
  INVALID:
    'There was an error while adding your token. Make sure that the canister id and the standard is correct.',
  ALREADY_EXIST: 'The token you are adding is already registered',
};

export type TokensContext = {
  tokens: {
    [key: string]: Token;
  };
  time?: string | number | void;
  activeTokens: {
    [key: string]: Token;
  };
  addToken?: (
    isLocal: boolean,
    canisterId: string,
    standard: IdlStandard,
    principal: Principal,
  ) => Promise<Token | string>;
  getBalance?: (isLocal: boolean, principal: Principal, token: Token) => Promise<number>;
  toggleToken?: (symbol: string) => void;
  refreshBalance?: (isLocal: boolean, principal: Principal, symbol: string) => void;
  refreshAllBalances?: (isLocal: boolean, principal: Principal) => void;
  setLocalCanisterId?: (symbol: string, cansterId: string) => void;
};

const defaultTokensMapped = () => {
  const defaultTokensMapped = {};
  Object.keys(defaultTokens).forEach((key: string) => {
    const token: Token = defaultTokens[key];
    defaultTokensMapped[token.symbol] = {
      canisterId: Principal.fromText(token.canisterId),
      icon: token.icon ?? token.symbol,
      ...token,
    };
  });
  return defaultTokensMapped;
};

const localStorageTokens = () => {
  const localStorageTokens = localStorage.getItem('tokensContext');
  if (!localStorageTokens) return undefined;

  return JSONBig.parse(localStorageTokens ?? '');
};
const initialTokens = localStorageTokens() ?? defaultTokensMapped();

export const TokensContext = createContext<TokensContext>({
  tokens: initialTokens,
  activeTokens:
    Object.keys(initialTokens)
      .filter((t) => initialTokens[t].enabled)
      .reduce((ats,key) => ({...ats, [key]: initialTokens[key]}), {}),
  time: timeConverter(BigInt(new Date().getTime() * 1000000))
});


export const useTokensContext = () => {
  const context = useContext(TokensContext);
  return context;
};



export const TokensContextProvider: React.FC = ({ children }) => {
  const [tokens, setTokens] = useState<TokensContext['tokens']>(initialTokens);
  const [time, setTime] = useState<any>()
  const addToken = async (
    isLocal: boolean,
    canisterId: string,
    standard: IdlStandard,
    principal: Principal,
  ) => {
    const metadata: any = await getMetadata(isLocal, canisterId, standard);
    const { symbol, fee, decimals, icon } = metadata || {};

    if (tokens[symbol]) return AddTokenError.ALREADY_EXIST;

    const token: Token = {
      symbol,
      canisterId,
      standard,
      icon,
      fee,
      enabled: true,
      decimals,
    };

    token.balance = await getBalance(isLocal, principal, token);
    const _tokens = tokens;
    _tokens[token.symbol] = token;
    setTokens(_tokens);
    localStorage.setItem('tokensContext', JSONBig.stringify(_tokens));
    return token;
  };

  const toggleToken = (symbol: string) => {
    setTokens((pTokens) => {
      /* eslint-disable no-param-reassign */
      pTokens[symbol].enabled = !pTokens[symbol].enabled;

      return { ...pTokens };
    });
  };

  const getBalance = async (isLocal: boolean, principal: Principal, token: Token) => {
    try {
      const balance = await getBalanceFromCanister(isLocal, principal, token);
      return balance.value / 10 ** balance.decimals;
    } catch {
      return 0;
    }
  };

  const refreshBalance = async (isLocal: boolean, principal: Principal, symbol: string) => {
    const balance = await getBalance(isLocal, principal, tokens[symbol]);
    setTokens((pTokens) => {
      pTokens[symbol].balance = balance;
      return { ...pTokens };
    });
  };

  const refreshAllBalances = async (isLocal: boolean, principal: Principal) => {
    // Refresh icon
    const _tokens = tokens;
    Object.keys(_tokens).map((symbol) => {
      _tokens[symbol].balance = -2;
    });
    setTokens(() => ({ ..._tokens }));

    const today = timeConverter(BigInt(new Date().getTime() * 1000000))
    setTime(today)
    // Actual balance
    return Promise.all(
      Object.keys(_tokens).map(async (symbol) => {
        _tokens[symbol].balance = await getBalance(isLocal, principal, _tokens[symbol]);
      }),
    ).then(() => {
      setTokens(() => ({ ..._tokens }));
    });
    
  };

  const setLocalCanisterId = (symbol: string, canisterId: string) => {
    setTokens((pTokens) => {
      pTokens[symbol].localCanisterId = canisterId;
      return { ...pTokens };
    });
  };

  useEffect(() => {
    localStorage.setItem('tokensContext', JSONBig.stringify(tokens));
  }, [tokens]);

  return (
    <TokensContext.Provider
      value={{
        addToken,
        getBalance,
        refreshAllBalances,
        refreshBalance,
        setLocalCanisterId,
        toggleToken,
        tokens,
        time,
        activeTokens:
          Object.keys(tokens)
            .filter((t) => tokens[t].enabled)
            .reduce((ats,key) => ({...ats, [key]: tokens[key]}), {}),
      }}
    >
      {children}
    </TokensContext.Provider>
  );
};

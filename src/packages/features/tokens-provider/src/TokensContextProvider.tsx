import { IdlStandard } from '@dapp/utils';
import { Principal } from '@dfinity/principal';
import JSONBig from 'json-bigint';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { PerpetualOSContext } from '@dapp/features-context-provider';
import { getBalance as getBalanceFromCanister } from './getBalance';
import { getMetadata } from './getMetadata';
import { timeConverter } from '@dapp/utils';
import { TokenRounded } from '@mui/icons-material';

// default to mainnet token canisters
const defaultTokens = {
  ICP: {
    symbol: 'ICP',
    // eslint-disable-next-line
    canisterId: process.env.ICP_LEDGER_CANISTER_ID,
    fee: 10000,
    standard: IdlStandard.ICP,
    decimals: 8,
    enabled: true,
    balance: 0,
  },
  OGY: {
    symbol: 'OGY',
    // eslint-disable-next-line
    canisterId: process.env.OGY_LEDGER_CANISTER_ID,
    fee: 200000,
    standard: IdlStandard.ICP,
    decimals: 8,
    enabled: true,
    balance: 0,
  },
};

export type Token = {
  balance?: number;
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
  walletTokens: {
    [key: string]: Token;
  };
  time?: string | number | void;
  activeTokens: {
    [key: string]: Token;
  };
  isFetchingBalance: boolean;
  addToken?: (
    canisterId: string,
    standard: IdlStandard,
    principal: Principal,
  ) => Promise<Token | string>;
  getBalance?: (principal: Principal, token: Token) => Promise<number>;
  toggleToken?: (symbol: string) => void;
  refreshBalance?: (principal: Principal, symbol: string) => void;
  refreshAllBalances?: (principal: Principal) => void;
};

const defaultTokensMapped = () => {
  const defaultTokensMapped = {};
  Object.keys(defaultTokens).forEach((key: string) => {
    const token: Token = defaultTokens[key];

    if (token.canisterId) {
      defaultTokensMapped[token.symbol] = {
        canisterId: Principal.fromText(token.canisterId),
        icon: token.icon ?? token.symbol,
        ...token,
      };
    }
  });
  return defaultTokensMapped;
};

const localStorageTokens = () => {
  const localStorageTokens = localStorage.getItem('tokensContext');

  if (!localStorageTokens) {
    return undefined;
  }

  return JSONBig.parse(localStorageTokens ?? '');
};

const initialTokens = localStorageTokens() ?? defaultTokensMapped();

const walletTokens = Object.keys(initialTokens)
  .filter((t) => initialTokens[t].enabled && ['OGY', 'ICP'].includes(t.toUpperCase()))
  .reduce((ats, key) => ({ ...ats, [key]: initialTokens[key] }), {});

const activeTokens = Object.keys(initialTokens)
  .filter((t) => initialTokens[t].enabled)
  .reduce((ats, key) => ({ ...ats, [key]: initialTokens[key] }), {});

export const TokensContext = createContext<TokensContext>({
  tokens: initialTokens,
  walletTokens,
  activeTokens,
  time: timeConverter(BigInt(new Date().getTime() * 1000000)),
  isFetchingBalance: false,
});

export const useTokensContext = () => {
  const context = useContext(TokensContext);
  return context;
};

export const TokensContextProvider: React.FC = ({ children }) => {
  const [tokens, setTokens] = useState<TokensContext['tokens']>(initialTokens);
  const [time, setTime] = useState<any>();
  const [isFetchingBalance, setIsFetchingBalance] = useState(false);
  const context = useContext(PerpetualOSContext);

  const addToken = async (canisterId: string, standard: IdlStandard, principal: Principal) => {
    const metadata: any = await getMetadata(context.isLocal, canisterId, standard);
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

    token.balance = await getBalance(principal, token);

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

  const getBalance = async (principal: Principal, token: Token) => {
    try {
      setIsFetchingBalance(true);

      const balance = await getBalanceFromCanister(context.isLocal, principal, token);
      return balance.value / 10 ** balance.decimals;
    } catch (e) {
      console.error(e);
      return 0;
    } finally {
      setIsFetchingBalance(false);
    }
  };

  const refreshBalance = async (principal: Principal, symbol: string) => {
    try {
      const balance = await getBalance(principal, tokens[symbol]);
      setTokens((pTokens) => {
        pTokens[symbol].balance = balance;
        return { ...pTokens };
      });
    } catch (e) {
      console.error(e);
    }
  };

  const refreshAllBalances = async (principal: Principal) => {
    // Refresh icon
    const _tokens = tokens;
    Object.keys(_tokens).map((symbol) => {
      _tokens[symbol].balance = 0;
    });
    setTokens(() => ({ ..._tokens }));

    const today = timeConverter(BigInt(new Date().getTime() * 1000000));
    setTime(today);
    // Actual balance
    return Promise.all(
      Object.keys(_tokens).map(async (symbol) => {
        _tokens[symbol].balance = await getBalance(principal, _tokens[symbol]);
      }),
    ).then(() => {
      setTokens(() => ({ ..._tokens }));
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
        toggleToken,
        tokens,
        walletTokens,
        time,
        activeTokens: Object.keys(tokens)
          .filter((t) => tokens[t].enabled)
          .reduce((ats, key) => ({ ...ats, [key]: tokens[key] }), {}),
        isFetchingBalance,
      }}
    >
      {children}
    </TokensContext.Provider>
  );
};

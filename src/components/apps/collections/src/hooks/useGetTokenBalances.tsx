import { useQuery } from '@tanstack/react-query';
import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { currencies } from '../constants/currencies';
import { idlFactory as tokenIdlFactory } from '../canisters/tokens/info.did';
import { useTokenData } from '../context/TokenDataContext';

interface BalanceDetails {
  amount: number;
  currency: string;
  totalUSD: number;
}

/**
 * Fetches token balance from a specific canister.
 */
const getTokenBalance = async (canisterId: string, principal: Principal): Promise<bigint> => {
  try {
    const agent = new HttpAgent({ host: 'https://ic0.app' });
    const actor = Actor.createActor(tokenIdlFactory, { agent, canisterId });

    const balance = await actor.icrc1_balance_of({
      owner: principal,
      subaccount: [],
    });

    return balance as bigint;
  } catch (error) {
    console.error(`Error fetching balance from canister ${canisterId}:`, error);
    return BigInt(0);
  }
};

/**
 * Fetches balances for all usable tokens and applies decimals conversion.
 */
const fetchTokenBalances = async (
  principal: Principal,
  getUSDPrice: (tokenCode: string) => number | undefined,
): Promise<BalanceDetails[]> => {  
  const balances: BalanceDetails[] = [];

  for (const currency of currencies) {
    if (currency.isUsable) {
      const balance = await getTokenBalance(currency.canisterId, principal);
      const priceUSD = getUSDPrice(currency.code) || 0;

      const decimals = currency.decimals || 8;

      const adjustedAmount = Number(balance) / Math.pow(10, decimals);

      balances.push({
        amount: adjustedAmount,
        currency: currency.code,
        totalUSD: adjustedAmount * priceUSD,
      });
    }
  }

  return balances;
};

/**
 * Custom hook to get token balances for a connected user.
 */
export const useGetTokenBalances = (principal: Principal | undefined) => {
  const { getUSDPrice } = useTokenData();

  return useQuery<BalanceDetails[], Error>({
    queryKey: ['tokenBalances', principal?.toText()],
    queryFn: () => fetchTokenBalances(principal!, getUSDPrice),
    enabled: !!principal,
    staleTime: 21600000,
    refetchOnWindowFocus: false,
  });
};

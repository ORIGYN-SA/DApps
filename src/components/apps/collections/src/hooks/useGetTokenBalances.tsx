// src/hooks/useGetTokenBalances.tsx
import { useQuery } from '@tanstack/react-query'
import { Actor, HttpAgent } from '@dfinity/agent'
import { Principal } from '@dfinity/principal'
import { currencies } from '../constants/currencies'
import { idlFactory as tokenIdlFactory } from '../canisters/tokens/info.did'
import { useTokenData } from '../context/TokenDataContext'

interface BalanceDetails {
  amount: number
  currency: string
  totalUSD: number
  logo: string
}

/**
 * Fetches token balance from a specific canister.
 */
const getTokenBalance = async (canisterId: string, principal: Principal): Promise<bigint> => {
  try {
    const agent = new HttpAgent({ host: 'https://ic0.app' })
    const actor = Actor.createActor(tokenIdlFactory, { agent, canisterId })

    const balance = await actor.icrc1_balance_of({
      owner: principal,
      subaccount: [],
    })

    return balance as bigint
  } catch (error) {
    console.error(`Error fetching balance from canister ${canisterId}:`, error)
    return BigInt(0)
  }
}

/**
 * Fetches balances for all usable tokens and applies decimals conversion.
 */
const fetchTokenBalances = async (
  principal: Principal,
  getUSDPrice: (tokenCode: string) => number,
): Promise<BalanceDetails[]> => {
  const balances: BalanceDetails[] = []

  for (const currency of currencies) {
    if (currency.isUsable) {
      const balance = await getTokenBalance(currency.canisterId, principal)
      const priceUSD = getUSDPrice(currency.code)

      const decimals = currency.decimals || 8

      const adjustedAmount = Number(balance) / Math.pow(10, decimals)

      const logo = currency.icon

      balances.push({
        amount: adjustedAmount,
        currency: currency.code,
        totalUSD: adjustedAmount * priceUSD,
        logo,
      })
    }
  }

  return balances
}

/**
 * Custom hook to get token balances for a connected user.
 */
export const useGetTokenBalances = (principal: Principal | undefined, enabled: boolean) => {
  const { getUSDPrice } = useTokenData()

  return useQuery<BalanceDetails[], Error>({
    queryKey: ['tokenBalances', principal?.toText()],
    queryFn: () => fetchTokenBalances(principal!, getUSDPrice),
    enabled: !!principal && enabled,
    refetchInterval: 60000,
    staleTime: 60000,
    refetchOnWindowFocus: true,
  })
}

import { useMemo } from 'react'
import { useIdentityKit } from '@nfid/identitykit/react'
import { UserProfile } from '../context/UserProfileContext'
import { useAuth } from '@dapp/features-authentication'
import { useGetTokenBalances } from '@dapp/common-hooks'
import { useTokenData } from '@dapp/features-tokensdata'
import { formatWalletUpdatedDate } from '@dapp/utils'

interface BalanceDetails {
  amount: number
  currency: string
  totalUSD: number
  logo: string
}

interface CombinedUserProfileContextProps {
  userProfile: UserProfile | null
  isLoading: boolean
  error: Error | null
  lastUpdated: string | null
}

export const useCombinedUserProfile = (): CombinedUserProfileContextProps => {
  const { user } = useIdentityKit()
  const { isConnected } = useAuth()

  const {
    data: tokenBalances,
    isLoading: isBalancesLoading,
    isError: isBalancesError,
    error: balancesError,
  } = useGetTokenBalances(user?.principal, isConnected && !!user?.principal)

  const { tokens, isLoading: isTokenDataLoading } = useTokenData()

  const userProfile: UserProfile | null = useMemo(() => {
    if (isConnected && user?.principal && tokenBalances) {
      const validBalances = tokenBalances
        .map(balance => {
          const token = tokens.find(t => t.symbol === balance.currency)
          if (token && token.logo) {
            return {
              amount: balance.amount,
              currency: balance.currency,
              totalUSD: balance.amount * (token.priceUSD || 0),
              logo: token.logo,
            }
          }
          return null
        })
        .filter((balance): balance is BalanceDetails => balance !== null)
      return {
        name: user.principal.toText(),
        walletAddress: user.principal.toText(),
        balances: validBalances,
        profileImage: '/assets/profile_icon.svg',
      }
    }
    return null
  }, [isConnected, user, tokenBalances, tokens])

  const lastUpdated = useMemo(() => {
    if (userProfile) {
      return formatWalletUpdatedDate(new Date())
    }
    return null
  }, [userProfile])

  const isLoading = isTokenDataLoading || isBalancesLoading

  return useMemo(
    () => ({
      userProfile,
      isLoading,
      error: isBalancesError ? balancesError : null,
      lastUpdated,
    }),
    [userProfile, isLoading, isBalancesError, balancesError, lastUpdated],
  )
}

// src/hooks/useCombinedUserProfile.tsx
import { useMemo } from 'react'
import { useIdentityKit } from '@nfid/identitykit/react'
import { useAuth } from '../auth'
import { useGetTokenBalances } from './useGetTokenBalances'
import { useTokenData } from '../context/TokenDataContext'
import { formatWalletUpdatedDate } from '../utils/date'
import { UserProfile } from '../context/UserProfileContext'

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
      return {
        name: user.principal.toText(),
        walletAddress: user.principal.toText(),
        balances: tokenBalances.map(balance => {
          const token = tokens.find(t => t.symbol === balance.currency)
          return {
            amount: balance.amount,
            currency: balance.currency,
            totalUSD: balance.amount * (token?.priceUSD || 0),
            logo: token?.logo || '/assets/default_logo.svg',
          }
        }),
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

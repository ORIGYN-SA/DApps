import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useIdentityKit } from '@nfid/identitykit/react'
import { useAuth } from '../auth'
import { useGetTokenBalances } from '../hooks/useGetTokenBalances'
import { useTokenData } from './TokenDataContext'
import { formatWalletUpdatedDate } from '../utils/date'

interface BalanceDetails {
  amount: number
  currency: string
  totalUSD: number
  logo: string
}

export interface UserProfile {
  name: string
  walletAddress: string
  balances: BalanceDetails[]
  profileImage: string
}

interface UserProfileContextProps {
  userProfile: UserProfile | null
  isLoading: boolean
  error: Error | null
  lastUpdated: string | null // Adding lastUpdated property to the context
}

const UserProfileContext = createContext<UserProfileContextProps | undefined>(undefined)

export const useUserProfile = () => {
  const context = useContext(UserProfileContext)
  console.log('context', context)
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider')
  }
  return context
}

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useIdentityKit()
  const { isConnected } = useAuth()

  const { isLoading: isTokenDataLoading } = useTokenData()

  const {
    data: tokenBalances,
    isLoading: isBalancesLoading,
    isError,
    error,
  } = useGetTokenBalances(user?.principal, !isTokenDataLoading)

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  useEffect(() => {
    if (
      isConnected &&
      user?.principal &&
      tokenBalances &&
      !isBalancesLoading &&
      !isTokenDataLoading
    ) {
      const profile: UserProfile = {
        name: user.principal.toText(),
        walletAddress: user.principal.toText(),
        balances: tokenBalances,
        profileImage: '/assets/profile_icon.svg',
      }
      setUserProfile(profile)

      // Update the last updated time when profile is set
      setLastUpdated(formatWalletUpdatedDate(new Date())) // Set the current date and time
    }

    setIsLoading(isTokenDataLoading || isBalancesLoading)
  }, [isConnected, user, tokenBalances, isBalancesLoading, isTokenDataLoading])

  const profileValue = useMemo(
    () => ({
      userProfile,
      isLoading: isLoading || isTokenDataLoading || isBalancesLoading,
      error: isError ? error : null,
      lastUpdated, // Pass the lastUpdated state to the context
    }),
    [userProfile, isLoading, isTokenDataLoading, isBalancesLoading, isError, error, lastUpdated],
  )

  return <UserProfileContext.Provider value={profileValue}>{children}</UserProfileContext.Provider>
}

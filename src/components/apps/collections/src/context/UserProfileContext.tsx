// src/context/UserProfileContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useIdentityKit } from '@nfid/identitykit/react'
import { useAuth } from '../auth'
import { useGetTokenBalances } from '../hooks/useGetTokenBalances'
import { useTokenData } from './TokenDataContext'

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
}

const UserProfileContext = createContext<UserProfileContextProps | undefined>(undefined)

export const useUserProfile = () => {
  const context = useContext(UserProfileContext)
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
      setIsLoading(false)
    } else if (!isTokenDataLoading && !isBalancesLoading) {
      setUserProfile(null)
      setIsLoading(false)
    }
  }, [isConnected, user, tokenBalances, isBalancesLoading, isTokenDataLoading])

  return (
    <UserProfileContext.Provider
      value={{
        userProfile,
        isLoading: isLoading || isTokenDataLoading || isBalancesLoading,
        error: isError ? error : null,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  )
}

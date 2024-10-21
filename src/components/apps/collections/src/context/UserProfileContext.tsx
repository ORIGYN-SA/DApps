// src/context/UserProfileContext.tsx
import React, { createContext, useContext } from 'react'
import { useCombinedUserProfile } from '../hooks/useCombinedUserProfile'
import { useAuth } from '../auth'

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
  lastUpdated: string | null
}

const UserProfileContext = createContext<UserProfileContextProps | undefined>(undefined)

export const useUserProfile = (): UserProfileContextProps => {
  const context = useContext(UserProfileContext)
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider')
  }
  return context
}

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const profile = useCombinedUserProfile()

  return <UserProfileContext.Provider value={profile}>{children}</UserProfileContext.Provider>
}

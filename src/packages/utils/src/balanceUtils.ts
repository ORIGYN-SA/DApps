import { UserProfile } from '@dapp/features-userprofile'

export const getUserBalance = (userProfile: UserProfile | null, currency: string) => {
  if (userProfile) {
    const userBalance = userProfile.balances.find(balance => balance.currency === currency)
    if (userBalance) {
      return userBalance.amount
    }
  }
  return 0
}

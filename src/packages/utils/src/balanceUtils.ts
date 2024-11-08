import { UserProfile, UserProfileProvider } from './../context/UserProfileContext';
import { Currency } from "../constants/currencies";

export const getUserBalance = (userProfile: UserProfile | null , currency: string) => {
    if (userProfile) {
      const userBalance = userProfile.balances.find((balance) => balance.currency === currency);
      if (userBalance) {
        return userBalance.amount;
      }
    }
    return 0;
  }
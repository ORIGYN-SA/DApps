interface ConstantsMap {
  [key: string]: string;
}

export const VALIDATION: ConstantsMap = {
  insufficientFunds: 'Insufficient funds',
  amountLessThanFee: 'Amount must not be less than the fee',
  mustBeGreaterThan: 'Must be greater than',
  offerMustBeGreaterThanTxFee: 'Offer must be greater than the transaction fee of',
  minimumBid: 'Minimum bid is',
  bidHigherThanBuyNow: 'Bid must be less than buy now price',
  notANumber: 'This must be a number',
  notANullableNumber: 'This cannot be a nullable number',
  startPriceRequired: 'Start price is required',
  startPriceGreaterThanZero: 'Start price must be greater than 0',
  reserveBuyPriceGreaterThanBuyNowPrice: 'Reserve buy price must be smaller than the buy now price',
  instantBuyPriceSmallerThanStartPrice: 'Instant buy price must be greater than the start price',
  endDateSmallerThanStartDate: 'The end date needs to be at least one day after start date',
  amountRequired: 'An amount is required',
  recipientAddressRequired: 'A recipient address is required',
  invalidRecipientAddress:
    'Invalid recipient address, please enter a valid principal or account number',
};

export const STATUS: ConstantsMap = {
  sendingTokensDepositAccount: 'Sending tokens to deposit account',
  sendingTokensEscrowAccount: 'Sending tokens to escrow account',
  creatingBid: 'Creating bid',
};

export const ERROR: ConstantsMap = {
  tokenNotSelected: 'Token not selected',
  walletNotConnected: 'Wallet not connected',
  formHasErrors: 'Please correct the errors in the form',
  tokenMetadataRetrieval: 'Unable to retrieve metadata of tokens',
  tokenBalanceRetrieval: 'Unable to retrieve balance of tokens',
  tokenSaleInfoRetrieval: 'Unable to retrieve sale information of tokens',
  endSale: 'Unable to end the sale',
  depositWithdraw: 'Unable to withdraw',
  offerWithdraw: 'Unable to withdraw offer',
  rejectOffer: 'Unable to reject offer',
  acceptOffer: 'Unable to accept offer',
  auction: 'Unable to start an auction',
};

export const SUCCESS: ConstantsMap = {
  endSale: 'Sale ended successfully',
  depositWithdraw: 'Withdrawal successful',
  offerWithdraw: 'Offer withdrawal successful',
  rejectOffer: 'Offer rejection successful',
  acceptOffer: 'Offer acceptance successful',
  auction: 'Auction started successfully',
  purchase: 'Purchase successful',
  placeBid: 'Bid placement successful',
  placeOffer: 'Offer placement successful',
};

import * as React from 'react';
import BigNumber from 'bignumber.js';
import { useDebug } from '@dapp/features-debug-provider';
import { AuthContext } from '@dapp/features-authentication';
import { LoadingContainer } from '@dapp/features-components';
import { useTokensContext, Token } from '@dapp/features-tokens-provider';
import {
  Modal,
  Container,
  TextInput,
  Flex,
  Select,
  Button,
  HR,
  theme,
} from '@origyn/origyn-art-ui';
import { useEffect } from 'react';
import {
  toBigNumber,
  toLargerUnit,
  toSmallerUnit,
  OdcDataWithSale,
  validateTokenAmount,
} from '@dapp/utils';
import { useUserMessages } from '@dapp/features-user-messages';
import { useApi } from '@dapp/common-api';
import { ERROR, STATUS, SUCCESS, VALIDATION } from '../constants';
import { TokenIcon } from '@dapp/features-components';

export type EscrowType = 'BuyNow' | 'Bid' | 'Offer';

export type StartEscrowModalProps = {
  odc: OdcDataWithSale;
  escrowType: EscrowType;
  open: boolean;
  onClose: (any) => void;
  onSuccess: any;
  onProcessing: (boolean) => void;
};

type FormErrors = {
  token: string;
  amount: string;
};

export function StartEscrowModal({
  odc,
  escrowType,
  open,
  onClose,
  onSuccess,
  onProcessing,
}: StartEscrowModalProps) {
  const debug = useDebug();
  const { getDepositAccountNumber, sendTokensToDepositAccount, sendEscrow, createBid } = useApi();
  const { showSuccessMessage, showErrorMessage, showUnexpectedErrorMessage } = useUserMessages();
  const { principal, activeWalletProvider } = React.useContext(AuthContext);
  const { tokens, refreshAllBalances } = useTokensContext();

  const [isLoading, setIsLoading] = React.useState(true);
  const [isTransacting, setIsTransacting] = React.useState(false);
  const [status, setStatus] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const [token, setToken] = React.useState<Token>();
  const [enteredAmount, setEnteredAmount] = React.useState('');
  const [total, setTotal] = React.useState<BigNumber>(new BigNumber(0));
  const [minBid, setMinBid] = React.useState<BigNumber>(new BigNumber(0));

  const [formErrors, setFormErrors] = React.useState<FormErrors>({
    amount: '',
    token: '',
  });

  useEffect(() => {
    // initialize form values
    if (open && odc && tokens) {
      let minAmount = 0;
      if (escrowType === 'BuyNow') {
        minAmount = odc.buyNow;
      } else if (escrowType === 'Bid') {
        minAmount =
          odc.currentBid > 0 ? odc.currentBid + Number(odc.minIncreaseAmount) : odc.startPrice;
      } else if (escrowType === 'Offer') {
        minAmount = odc.startPrice;
      }

      const decimals = Number(odc.token.decimals);
      const initialAmount = toLargerUnit(minAmount, Number(decimals));
      const initialToken = tokens[odc.token.symbol];
      const initialTotal = getDisplayTotal(initialAmount, initialToken);
      const initialMinBid = toLargerUnit(
        Math.max(odc.startPrice, odc.currentBid + Number(odc.minIncreaseAmount)),
        Number(decimals),
      );

      setToken(initialToken);
      setEnteredAmount(initialAmount.toFixed());
      setTotal(initialTotal);
      setMinBid(initialMinBid);

      setIsLoading(false);
    }
  }, [open]);

  const onTokenChanged = (tokenSymbol?: any) => {
    const newToken = tokens[tokenSymbol];
    const newTotal = getDisplayTotal(toBigNumber(enteredAmount), newToken);

    setToken(newToken);
    setTotal(newTotal);
    setFormErrors({ ...formErrors, token: undefined, amount: undefined });
  };

  const onAmountChanged = (enteredAmount: string) => {
    setEnteredAmount(enteredAmount);
    let validationMsg = validateTokenAmount(enteredAmount, token.decimals);
    if (validationMsg) {
      setFormErrors({ ...formErrors, amount: validationMsg });
      return false;
    }
    const fee = toLargerUnit(token.fee, token.decimals);
    const amount = toBigNumber(enteredAmount);
    const balance = toBigNumber(tokens[token.symbol].balance);
    if (amount.plus(fee).plus(fee).isGreaterThan(balance)) {
      setFormErrors({ ...formErrors, amount: VALIDATION.insufficientFunds });
    } else {
      const newTotal = getDisplayTotal(amount, token);
      setTotal(newTotal);
      setFormErrors({ ...formErrors, amount: undefined });
    }
  };

  const getDisplayTotal = (amount: BigNumber, token: Token): BigNumber => {
    const twoPartTxFees = toLargerUnit(token.fee * 2, token.decimals);
    return amount.plus(twoPartTxFees); //.decimalPlaces(token.decimals);
  };

  const hasErrors = (): boolean => {
    return !!(formErrors.amount || formErrors.token);
  };

  const validateForm = () => {
    let errors = { amount: '', token: undefined };
    const fee = toLargerUnit(token.fee, token.decimals);
    const balance = toBigNumber(tokens[token.symbol].balance);

    let validationMsg = validateTokenAmount(enteredAmount, token.decimals);
    if (validationMsg) {
      errors = { ...errors, amount: validationMsg };
      return false;
    }
    const amount = toBigNumber(enteredAmount);
    if (amount.isLessThanOrEqualTo(0)) {
      errors = { ...errors, amount: `${escrowType} ${VALIDATION.mustBeGreaterThan} 0` };
    } else if (amount.plus(fee).plus(fee).isGreaterThan(balance)) {
      errors = { ...errors, amount: VALIDATION.insufficientFunds };
    } else if (escrowType === 'Offer' && amount.isLessThanOrEqualTo(fee)) {
      errors = {
        ...errors,
        amount: `${VALIDATION.offerMustBeGreaterThanTxFee} ${fee.toFixed(token.decimals)} ${
          token.symbol
        }`,
      };
    } else if (escrowType == 'Bid') {
      if (amount.isLessThan(minBid)) {
        errors = {
          ...errors,
          amount: `${VALIDATION.minimumBid} ${minBid.toFixed()} ${odc.tokenSymbol}`,
        };
      } else if (amount.isGreaterThan(toLargerUnit(odc.buyNow, token.decimals))) {
        errors = {
          ...errors,
          amount: `${VALIDATION.bidHigherThanBuyNow} (${toLargerUnit(odc.buyNow, token.decimals)} ${
            odc.tokenSymbol
          })`,
        };
      }
    }

    if (!token) {
      errors = { ...errors, token: ERROR.tokenNotSelected };
    }

    // if there are any form errors, notify the user
    if (errors.amount || errors.token) {
      setFormErrors(errors);
      return false;
    }

    return true;
  };

  const onFormSubmitted = async (e: any) => {
    e.preventDefault();

    if (isLoading || isTransacting) {
      return;
    }

    if (!activeWalletProvider) {
      showErrorMessage(ERROR.walletNotConnected);
      return;
    }

    if (!validateForm() || hasErrors()) {
      showErrorMessage(ERROR.formHasErrors);
      return;
    }

    try {
      setIsTransacting(true);
      onProcessing(true);

      // Add a tx fee to the total escrow amount (second tx fee).
      // This is needed to move the money from the deposit account to the escrow account.
      const amount = toSmallerUnit(Number(enteredAmount), token.decimals);
      const totalAmount = amount.plus(toBigNumber(token.fee)).decimalPlaces(token.decimals);
      debug.log('escrow amount with fee', totalAmount.toString());

      // Get deposit account number
      const getDepositAccountResult = await getDepositAccountNumber();
      const depositAccountId = getDepositAccountResult.result;
      if (!depositAccountId) {
        showErrorMessage(getDepositAccountResult.errorMessage);
        return;
      }
      debug.log('deposit account', depositAccountId);
      // Transfer tokens from buyer's wallet to the deposit account.
      // If this fails, the tokens should still be in the buyer's wallet.
      setStatus('Sending tokens to deposit account...');
      const sendTokensResult = await sendTokensToDepositAccount(
        depositAccountId,
        totalAmount,
        token,
      );
      if (!sendTokensResult.result) {
        showErrorMessage(sendTokensResult.errorMessage);
        return;
      }
      const transactionHeight = sendTokensResult.result;

      setStatus(STATUS.sendingTokens);
      // Transfer tokens from the deposit account to the escrow account.
      // If this fails, the buyer can withdraw the tokens from Manage Deposits in Vault.
      const sendEscrowResponse = await sendEscrow(
        token,
        totalAmount,
        transactionHeight,
        odc.id,
        odc.ownerPrincipalId,
        odc.saleId,
      );
      if (!sendEscrowResponse.result) {
        showErrorMessage(sendEscrowResponse.errorMessage);
        return;
      }
      const escrowReceipt = sendEscrowResponse.result;

      // If there's an open auction, this is a bid, not an offer
      // so create a bid from the escrow receipt and sale id.
      if (odc.auctionOpen) {
        setStatus(STATUS.creatingBid);
        const createBidResponse = await createBid(escrowReceipt, odc.saleId);
        if (!createBidResponse.result) {
          showErrorMessage(createBidResponse.errorMessage);
          return;
        }

        const purchased = !!createBidResponse.result?.['bid']?.txn_type?.sale_ended;
        if (purchased) {
          showSuccessMessage(SUCCESS.purchase);
        } else {
          showSuccessMessage(SUCCESS.placeBid);
        }
      } else {
        showSuccessMessage(SUCCESS.placeOffer);
      }

      onModalClose(true);
    } catch (e) {
      showUnexpectedErrorMessage(e);
    } finally {
      setStatus('');
      setIsTransacting(false);
      onProcessing(false);
    }
  };

  const getBuyNowPrice = (odc: OdcDataWithSale): string => {
    return toLargerUnit(odc.buyNow, odc.token.decimals).toFixed();
  };

  const getTransactionFee = (): string => {
    const doubleFee = toBigNumber(token.fee).times(toBigNumber(2));
    return `${toLargerUnit(doubleFee, token.decimals).toFixed()} ${token.symbol}`;
  };

  const onModalClose = (isSuccess: boolean) => {
    setIsLoading(false);
    setIsTransacting(false);
    onProcessing(false);
    onClose(isSuccess);
    setSuccess(isSuccess);
    if (isSuccess) {
      onSuccess();
    }
    refreshAllBalances(false, principal);
  };

  return (
    <Modal isOpened={open} closeModal={() => onModalClose(false)} size="md">
      <Container as="form" onSubmit={onFormSubmitted} size="full" padding="48px" smPadding="8px">
        {success ? (
          <>
            <h2>Success!</h2>
            <p className="secondary_color">All the transactions were made successfully.</p>
            <Flex justify="flex-end">
              <Button onClick={onModalClose}>Done</Button>
            </Flex>
          </>
        ) : (
          <>
            {isTransacting ? (
              <>
                <h2>Transactions in Progress</h2>
                <br />
                {status && (
                  <>
                    <p>{status}</p>
                  </>
                )}

                <LoadingContainer data-testid="loading-container" margin="24px" />
              </>
            ) : (
              <>
                {escrowType === 'Offer' ? (
                  <h2>Make an Offer</h2>
                ) : (
                  <h2>
                    Send escrow for <strong>{odc.id}</strong>?
                  </h2>
                )}

                <br />
                {!isLoading && (
                  <Flex flexFlow="column" gap={8}>
                    {escrowType === 'Offer' ? (
                      <Select
                        name="token"
                        selectedOption={{
                          /*@ts-ignore*/
                          label: (
                            <>
                              <TokenIcon symbol={token.symbol} /> {token.symbol}
                            </>
                          ),
                          value: token.symbol,
                        }}
                        handleChange={(opt) => onTokenChanged(opt.value)}
                        label="Token"
                        options={Object.keys(tokens).map((t) => ({
                          label: (
                            <>
                              <TokenIcon symbol={tokens[t].symbol} /> {tokens[t].symbol}
                            </>
                          ),
                          value: t,
                        }))}
                      />
                    ) : (
                      <>
                        <span>Token</span>
                        <span style={{ color: theme.colors.SECONDARY_TEXT }}>
                          {' '}
                          <TokenIcon symbol={token.symbol} /> {token.symbol}
                        </span>
                      </>
                    )}
                    {escrowType == 'BuyNow' ? (
                      <>
                        <br />
                        <span>Buy Now Price (in {token.symbol})</span>
                        <span style={{ color: theme.colors.SECONDARY_TEXT }}>
                          {getBuyNowPrice(odc)}
                        </span>
                      </>
                    ) : (
                      <>
                        <br />
                        <Flex flexFlow="row" align="center" justify="space-between">
                          <b>{escrowType == 'Bid' ? 'Your bid' : 'Price'}</b>
                          <span style={{ color: theme.colors.SECONDARY_TEXT }}>
                            Balance: {tokens[token.symbol].balance.toString()} {token.symbol}
                          </span>
                        </Flex>
                        {escrowType == 'Bid' && (
                          <span style={{ color: theme.colors.SECONDARY_TEXT }}>
                            {`Minimum bid: ${minBid.toFixed()} ${token.symbol}`}
                          </span>
                        )}
                        <TextInput
                          required
                          id="offerPrice"
                          name="offerPrice"
                          error={formErrors.amount}
                          onChange={(e) => onAmountChanged(e.target.value)}
                          value={enteredAmount}
                        />
                      </>
                    )}
                    <br />
                    {token && (
                      <>
                        <span style={{ color: theme.colors.SECONDARY_TEXT }}>
                          Network Fee (deducted from bid amount for the transaction cost)
                        </span>
                        <span style={{ color: theme.colors.SECONDARY_TEXT }}>
                          {getTransactionFee()}
                        </span>
                        <br />
                        <HR />
                        <br />
                        <Flex flexFlow="row" align="center" justify="space-between">
                          <h6>Total Amount</h6>
                          <span>{total.toFixed()}</span>
                        </Flex>
                        <br />
                        <HR />
                        <br />
                      </>
                    )}
                    <Flex align="center" justify="flex-end">
                      <Button btnType="filled" type="submit" disabled={hasErrors()}>
                        Submit
                      </Button>
                    </Flex>
                  </Flex>
                )}
              </>
            )}
          </>
        )}
      </Container>
    </Modal>
  );
}

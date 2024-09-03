import * as React from 'react';
import BigNumber from 'bignumber.js';
import { useDebug } from '@dapp/features-debug-provider';
import { AuthContext } from '@dapp/features-authentication';
import { ProgressBar } from '@dapp/features-components';
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
  token?: string;
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
  const { showErrorMessage } = useUserMessages();
  const { principal, activeWalletProvider } = React.useContext(AuthContext);
  const { walletTokens, refreshAllBalances } = useTokensContext();

  const [isLoading, setIsLoading] = React.useState(true);
  const [isTransacting, setIsTransacting] = React.useState(false);
  const [status, setStatus] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const [currentProgressIndex, setCurrentProgressIndex] = React.useState<number>(0);
  const [progressTitle, setProgressTitle] = React.useState<string>('');
  const [error, setError] = React.useState<boolean>(false);

  const [token, setToken] = React.useState<Token>();
  const [enteredAmount, setEnteredAmount] = React.useState('');
  const [total, setTotal] = React.useState<BigNumber>(new BigNumber(0));
  const [minBid, setMinBid] = React.useState<BigNumber>(new BigNumber(0));

  const [formErrors, setFormErrors] = React.useState<FormErrors>({
    amount: '',
    token: '',
  });

  useEffect(() => {
    if (!odc.token) {
      throw new Error('Token is undefined');
    }

    // initialize form values
    if (open && odc && walletTokens) {
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
      const initialToken = walletTokens[odc.token.symbol];
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
    const newToken = walletTokens[tokenSymbol];
    const newTotal = getDisplayTotal(toBigNumber(enteredAmount), newToken);

    setToken(newToken);
    setTotal(newTotal);
    setFormErrors({ ...formErrors, token: '', amount: '' });
  };

  const onAmountChanged = (enteredAmount: string) => {
    if (!token || !token.fee || !token.decimals) {
      throw new Error('Token is undefined');
    }

    setEnteredAmount(enteredAmount);
    let validationMsg = validateTokenAmount(enteredAmount, token.decimals);
    if (validationMsg) {
      setFormErrors({ ...formErrors, amount: validationMsg });
      return false;
    }
    const fee = toLargerUnit(token.fee, token?.decimals);
    const amount = toBigNumber(enteredAmount.trim() || 0);

    const balance = toBigNumber(walletTokens[token.symbol]?.balance || 0);

    if (amount.plus(fee).plus(fee).isGreaterThan(balance)) {
      setFormErrors({ ...formErrors, amount: VALIDATION.insufficientFunds });
    } else {
      const newTotal = getDisplayTotal(amount, token);
      setTotal(newTotal);
      setFormErrors({ ...formErrors, amount: '' });
    }
  };

  const getDisplayTotal = (amount: BigNumber, token: Token): BigNumber => {
    if (!token || !token.fee || !token.decimals) {
      throw new Error('Token is undefined');
    }

    const twoPartTxFees = toLargerUnit(token.fee * 2, token.decimals);
    return amount.plus(twoPartTxFees); //.decimalPlaces(token.decimals);
  };

  const hasErrors = (): boolean => {
    return !!(formErrors.amount || formErrors.token);
  };

  const validateForm = () => {
    if (!token || !token.decimals || !token.fee) {
      console.log('Token is undefined');
      throw new Error('Token is undefined');
    }

    let errors = { amount: '', token: undefined || '' };

    const fee = toLargerUnit(token.fee, token.decimals);
    const balance = toBigNumber(walletTokens[token.symbol]?.balance || 0);

    let validationMsg = validateTokenAmount(enteredAmount, token.decimals);
    if (validationMsg) {
      errors = { ...errors, amount: validationMsg };
      console.log('validationMsg', validationMsg);
      return false;
    }
    console.log('validationMsg');
    const amount = toBigNumber(enteredAmount);
    if (amount.isLessThanOrEqualTo(0)) {
      errors = {
        ...errors,
        amount: `${escrowType} ${VALIDATION.mustBeGreaterThan} 0`,
      };
    } else if (amount.plus(fee).plus(fee).isGreaterThan(balance)) {
      errors = { ...errors, amount: VALIDATION.insufficientFunds };
    } else if (amount.isLessThanOrEqualTo(fee.times(2))) {
      errors = {
        ...errors,
        amount: `${VALIDATION.offerMustBeGreaterThanTxFee} ${getTransactionFee()}`,
      };
    } else if (escrowType == 'Bid') {
      if (amount.isLessThan(minBid)) {
        errors = {
          ...errors,
          amount: `${VALIDATION.minimumBid} ${minBid.toFixed()} ${odc.tokenSymbol}`,
        };
      } else if (amount.plus(fee).plus(fee).isGreaterThan(balance)) {
        errors = { ...errors, amount: VALIDATION.insufficientFunds };
      } else if (amount.isGreaterThan(toLargerUnit(odc.buyNow, token.decimals))) {
        if (odc.buyNow !== 0) {
          errors = {
            ...errors,
            amount: `${VALIDATION.bidHigherThanBuyNow} (${toLargerUnit(
              odc.buyNow,
              token.decimals,
            )} ${odc.tokenSymbol})`,
          };
        }
      }
    }

    // errors = { ...errors, token: ERROR.tokenNotSelected };

    // if there are any form errors, notify the user
    console.log('validationMsg', errors, errors.amount || errors.token);
    if (errors.amount || errors.token) {
      setFormErrors(errors);
      return false;
    }

    return true;
  };

  const tryAgain = () => {
    onFormSubmitted(null, true);
  };

  const onFormSubmitted = async (e?: any, retry: boolean = false) => {
    e?.preventDefault();

    setCurrentProgressIndex(0);

    console.log(validateForm(), activeWalletProvider, error);
    if (!retry && (isLoading || isTransacting)) {
      return;
    }

    if (!activeWalletProvider) {
      showErrorMessage(ERROR.walletNotConnected);
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      if (!token || !token.decimals || !token.fee) {
        throw new Error('Token is undefined');
      }
      setIsTransacting(true);
      onProcessing(true);
      setCurrentProgressIndex(0);
      setProgressTitle('Transaction in progress');
      // Add a tx fee to the total escrow amount (second tx fee).
      // This is needed to move the money from the deposit account to the escrow account.
      const amount = toSmallerUnit(toBigNumber(enteredAmount), token.decimals);
      const totalAmount = amount.plus(
        toBigNumber(token.fee).plus(toBigNumber(token.fee)).decimalPlaces(token.decimals),
      );

      debug.log('escrow amount with fee', totalAmount.toString());

      // Get deposit account number
      const getDepositAccountResult = await getDepositAccountNumber();
      const depositAccountId = getDepositAccountResult.result;
      if (!depositAccountId) {
        setError(true);
        setStatus(getDepositAccountResult.errorMessage as string);
        setProgressTitle('Error');
        return;
      }
      debug.log('deposit account', depositAccountId);
      // Transfer tokens from buyer's wallet to the deposit account.
      // If this fails, the tokens should still be in the buyer's wallet.
      setStatus(STATUS.sendingTokensDepositAccount);
      setCurrentProgressIndex(1);
      const sendTokensResult = await sendTokensToDepositAccount(
        depositAccountId,
        totalAmount,
        token,
      );

      if (!sendTokensResult.result) {
        setError(true);
        setStatus(sendTokensResult.errorMessage as string);
        setProgressTitle('Error');
        return;
      }
      const transactionHeight = sendTokensResult.result;
      setStatus(STATUS.sendingTokensEscrowAccount);
      setCurrentProgressIndex(2);

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
        setError(true);
        setStatus(sendEscrowResponse.errorMessage as string);
        setProgressTitle('Error');
        return;
      }

      const escrowReceipt = sendEscrowResponse.result;

      // If there's an open auction, this is a bid, not an offer
      // so create a bid from the escrow receipt and sale id.
      if (odc.auctionOpen) {
        setStatus(STATUS.creatingBid);
        setCurrentProgressIndex(3);
        const createBidResponse = await createBid(escrowReceipt, odc.saleId);
        if (!createBidResponse.result) {
          setError(true);
          setStatus(createBidResponse.errorMessage as string);
          setProgressTitle('Error');
          return;
        }

        const purchased = !!createBidResponse.result?.['bid']?.txn_type?.sale_ended;
        if (purchased) {
          setCurrentProgressIndex(4);
          setStatus(SUCCESS.purchase);
        } else {
          setCurrentProgressIndex(4);
          setStatus(SUCCESS.placeBid);
        }
      } else {
        setCurrentProgressIndex(3);
        setStatus(SUCCESS.placeOffer);
      }
      setStatus('Escrow successfully sent.');
    } catch (e) {
      console.log(e);
      if (e instanceof Error) {
        setError(true);
        setStatus(e.message);
        setProgressTitle('Error');
      } else {
        setError(true);
        setStatus('An unknown error occurred');
        setProgressTitle('Error');
      }
    } finally {
      onProcessing(false);
    }
  };

  const getBuyNowPrice = (odc: OdcDataWithSale): string => {
    if (!odc.token || !odc.token.decimals) {
      throw new Error('Token is undefined');
    }
    return toLargerUnit(odc.buyNow, odc.token.decimals).toFixed();
  };

  const getTransactionFee = (): string => {
    if (!token || !token.decimals || !token.fee) {
      throw new Error('Token is undefined');
    }
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
    if (refreshAllBalances && principal) {
      refreshAllBalances(principal);
    }
  };

  return (
    <Modal isOpened={open} closeModal={() => onModalClose(false)} size="md">
      <Container as="form" onSubmit={onFormSubmitted} size="full" padding="48px" smPadding="8px">
        {success ? (
          <>
            <h2>Success!</h2>
            <p className="secondary_color">All the transactions were made successfully.</p>
            <Flex justify="flex-end">
              <Button onClick={onModalClose as any}>Done</Button>
            </Flex>
          </>
        ) : (
          <>
            {isTransacting ? (
              <Container>
                <Flex align="center" justify="center">
                  <ProgressBar
                    title={progressTitle}
                    message={status}
                    isError={error}
                    currentValue={currentProgressIndex}
                    maxValue={odc.auctionOpen ? 4 : 3}
                    doneAction={() => onModalClose(true)}
                    tryAgainAction={tryAgain}
                  />
                </Flex>
              </Container>
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
                    {escrowType === 'Offer' && token?.symbol ? (
                      <Select
                        name="token"
                        selectedOption={{
                          /*@ts-ignore*/
                          label: (
                            <>
                              <TokenIcon symbol={token?.symbol} /> {token?.symbol}
                            </>
                          ),
                          value: token?.symbol,
                        }}
                        handleChange={(opt) => onTokenChanged(opt.value)}
                        label="Token"
                        options={Object.keys(walletTokens).map((t) => ({
                          label: (
                            <>
                              <TokenIcon symbol={walletTokens[t].symbol} /> {walletTokens[t].symbol}
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
                          <TokenIcon symbol={token?.symbol} /> {token?.symbol}
                        </span>
                      </>
                    )}
                    {escrowType == 'BuyNow' ? (
                      <>
                        <br />
                        <span>Buy Now Price (in {token?.symbol})</span>
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
                            Balance:{' '}
                            {token?.symbol ? String(walletTokens[token?.symbol].balance) : 0}{' '}
                            {token?.symbol}
                          </span>
                        </Flex>
                        {escrowType == 'Bid' && (
                          <span style={{ color: theme.colors.SECONDARY_TEXT }}>
                            {`Minimum bid: ${minBid.toFixed()} ${token?.symbol}`}
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

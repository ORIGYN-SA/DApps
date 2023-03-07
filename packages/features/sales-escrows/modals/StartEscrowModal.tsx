import { useDebug } from '@dapp/features-debug-provider';
import { AuthContext } from '@dapp/features-authentication';
import { LoadingContainer } from '@dapp/features-components';
import { sendTransaction, useTokensContext, Token } from '@dapp/features-tokens-provider';
import { Principal } from '@dfinity/principal';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { Modal, Container, TextInput, Flex, Select, Button, HR } from '@origyn-sa/origyn-art-ui';
import { useEffect } from 'react';
import { toLargerUnit, OdcDataWithSale, toSmallerUnit, isPositiveFloat } from '@dapp/utils';

export type EscrowType = 'BuyNow' | 'Bid' | 'Offer';

export type StartEscrowModalProps = {
  odc: OdcDataWithSale;
  escrowType: EscrowType;
  open: boolean;
  onClose: any;
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
  const { actor, principal, activeWalletProvider } = React.useContext(AuthContext);
  const { tokens, refreshAllBalances } = useTokensContext();
  const { enqueueSnackbar } = useSnackbar() || {};

  const [isLoading, setIsLoading] = React.useState(true);
  const [isTransacting, setIsTransacting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const [token, setToken] = React.useState<Token>();
  const [amount, setAmount] = React.useState<number>(0);
  const [total, setTotal] = React.useState<number>(0);
  const [minBid, setMinBid] = React.useState<number>(0);

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

      const amount = toLargerUnit(minAmount, Number(odc.token.decimals));
      const token = tokens[odc.token.symbol];
      const total = getTotal(amount, token);
      const minBid = toLargerUnit(
        odc.currentBid + Number(odc.minIncreaseAmount),
        Number(odc.token.decimals),
      );

      setToken(token);
      setAmount(amount);
      setTotal(total);
      setMinBid(minBid);

      setIsLoading(false);
    }
  }, [open]);

  const onTokenChanged = (tokenSymbol?: any) => {
    const newToken = tokens[tokenSymbol];
    const newTotal = getTotal(amount, newToken);

    setToken(newToken);
    setTotal(newTotal);
    setFormErrors({ ...formErrors, token: undefined, amount: undefined });
  };

  const onAmountChanged = (enteredAmount: string) => {
    let amount = 0;
    let isValid = true;
    if (enteredAmount.trim()) {
      isValid = enteredAmount.trim() && isPositiveFloat(enteredAmount.trim());
      amount = isValid ? parseFloat(enteredAmount) : 0;
    }

    if (isValid) {
      const newTotal = getTotal(amount, token);
      setAmount(amount);
      setTotal(newTotal);
      setFormErrors({ ...formErrors, amount: undefined });
    } else {
      setFormErrors({ ...formErrors, amount: 'Invalid amount' });
    }
  };

  const getTotal = (amount: number, token: Token) => {
    return toLargerUnit(toSmallerUnit(amount, token.decimals) + token.fee, token.decimals);
  };

  const hasErrors = (): boolean => {
    return !!(formErrors.amount || formErrors.token);
  };

  const validateForm = () => {
    let errors = { amount: '', token: undefined };
    const fee = toLargerUnit(token.fee, token.decimals);

    if (isNaN(amount)) {
      errors = { ...errors, amount: `${escrowType} must be a number` };
    } else if (amount <= 0) {
      errors = { ...errors, amount: `${escrowType} must be greater than 0` };
    } else if (escrowType === 'Offer' && amount <= fee) {
      errors = {
        ...errors,
        amount: `Offer must be greater than the transaction fee of ${fee} ${token.symbol}`,
      };
    } else if (escrowType == 'Bid') {
      if (amount < minBid) {
        errors = {
          ...errors,
          amount: `The minimum bid is ${minBid} ${odc.tokenSymbol}`,
        };
      }
    }

    if (!token) {
      errors = { ...errors, token: 'No token selected' };
    }

    // if there are any form errors, notify the user
    if (errors.amount || errors.token) {
      setFormErrors(errors);
      return false;
    }

    return true;
  };

  const startEscrow = async () => {
    try {
      setIsTransacting(true);
      onProcessing(true);

      if (isLoading || isTransacting || !activeWalletProvider || hasErrors() || !validateForm()) {
        debug.log('validation failed');
        return;
      }

      // gets the deposit info for the account number of the caller
      const saleInfo = await actor.sale_info_nft_origyn({ deposit_info: [] });

      debug.log('return value of actor.sale_info_nft_origyn({ deposit_info: [] })');
      debug.log(JSON.stringify(saleInfo, null, 2));

      if ('err' in saleInfo) {
        throw new Error(saleInfo.err[0]);
      }

      if (!('deposit_info' in saleInfo.ok)) {
        throw new Error('Deposit info not found in sale info');
      }

      const account_id = saleInfo?.ok?.deposit_info?.account_id;
      if (!account_id) {
        throw new Error('Account ID not found in sale info');
      }

      const transactionHeight = await sendTransaction(
        false,
        activeWalletProvider,
        token,
        account_id,
        toSmallerUnit(total, token.decimals),
      );

      if (transactionHeight.err) {
        throw Error(transactionHeight.err);
      }

      const totalAmount = toSmallerUnit(total, token.decimals);

      const escrowData = {
        token_id: odc.id,
        deposit: {
          token: {
            ic: {
              fee: BigInt(token.fee),
              decimals: BigInt(token.decimals),
              canister: Principal.fromText(token.canisterId),
              standard: { Ledger: null },
              symbol: token.symbol,
            },
          },
          trx_id: [{ nat: BigInt(transactionHeight.ok) }],
          seller: { principal: Principal.fromText(odc.ownerPrincipalId) },
          buyer: { principal },
          amount: BigInt(totalAmount),
          sale_id: odc.saleId ? [odc.saleId] : [],
        },
        lock_to_date: [],
      };

      debug.log('escrowData sent to actor.sale_nft_origyn({ escrow_deposit: escrowData })');
      debug.log(JSON.stringify(escrowData, null, 2));

      const escrowResponse = await actor.sale_nft_origyn({ escrow_deposit: escrowData });
      if ('err' in escrowResponse) {
        throw new Error(escrowResponse.err[0]);
      }

      if (odc.auctionOpen) {
        // if the ODC is on auction, then this is a bid in the auction
        const bidData = {
          broker_id: [],
          escrow_receipt: escrowResponse?.ok?.escrow_deposit.receipt,
          sale_id: odc.saleId,
        };

        const bidResponse = await actor.sale_nft_origyn({ bid: bidData }); // TODO: fix this

        debug.log('bidData sent to actor.sale_nft_origyn({ bid: bidData })');
        debug.log(JSON.stringify(bidData, null, 2));
        debug.log('response from actor.sale_nft_origyn({ bid: bidData })');
        debug.log(JSON.stringify(bidResponse, null, 2));

        if ('err' in bidResponse) {
          throw new Error(bidResponse.err.text);
        }

        enqueueSnackbar('Your bid has been successfully placed.', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
        onCustomClose(true);
        refreshAllBalances(false, principal);
        setSuccess(true);
        onSuccess();
      } else {
        // if there is no auction, then this is just an offer
        enqueueSnackbar('Your escrow has been successfully sent.', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
        onCustomClose(true);
        refreshAllBalances(false, principal);
        setSuccess(true);
        onSuccess();
      }
    } catch (e) {
      debug.log(e);
      enqueueSnackbar(`Error: ${e?.message ?? e}.`, {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
    } finally {
      setIsTransacting(false);
      onProcessing(false);
    }
  };

  const onCustomClose = (value: any) => {
    setIsLoading(false);
    setIsTransacting(false);
    setSuccess(false);
    onClose(value);
  };

  const onFormSubmitted = async (e: any) => {
    e.preventDefault();
    startEscrow();
  };

  return (
    <div>
      <Modal isOpened={open} closeModal={() => onCustomClose} size="md">
        <Container as="form" onSubmit={onFormSubmitted} size="full" padding="48px" smPadding="8px">
          {success ? (
            <>
              <h2>Success!</h2>
              <p className="secondary_color">All the transactions were made successfully.</p>
              <Flex justify="flex-end">
                <Button onClick={onCustomClose}>Done</Button>
              </Flex>
            </>
          ) : (
            <>
              {isTransacting ? (
                <>
                  <h2>Transactions in Progress</h2>
                  <br />
                  <LoadingContainer data-testid="loading-container" />
                </>
              ) : (
                <>
                  <h2>
                    Send escrow for <strong>{odc.id}</strong>?
                  </h2>
                  <br />
                  {!isLoading && (
                    <Flex flexFlow="column" gap={8}>
                      {escrowType === 'Offer' ? (
                        <Select
                          name="token"
                          selectedOption={{
                            label: token.symbol,
                            value: token.symbol,
                          }}
                          handleChange={(opt) => onTokenChanged(opt.value)}
                          label="Token"
                          options={Object.keys(tokens).map((t) => ({
                            label: tokens[t].symbol,
                            value: t,
                          }))}
                        />
                      ) : (
                        <>
                          <span>Token:</span>
                          <span style={{ color: 'grey' }}>{token.symbol}</span>
                        </>
                      )}
                      {escrowType == 'BuyNow' ? (
                        <>
                          <br />
                          <span>Buy Now Price (in {token.symbol})</span>
                          <span style={{ color: 'grey' }}>
                            {toLargerUnit(odc.buyNow, token.decimals)}
                          </span>
                        </>
                      ) : (
                        <>
                          <br />
                          <TextInput
                            required
                            label={
                              escrowType == 'Bid'
                                ? `Your bid (min ${minBid} ${token.symbol})`
                                : `Your offer (in ${token.symbol})`
                            }
                            id="offerPrice"
                            name="offerPrice"
                            error={formErrors.amount}
                            onChange={(e) => onAmountChanged(e.target.value)}
                          />
                        </>
                      )}
                      <br />
                      {token && (
                        <>
                          <span>Transaction Fee</span>
                          <span style={{ color: 'grey' }}>{`${toLargerUnit(
                            token.fee,
                            token.decimals,
                          )}${' '}${token?.symbol}`}</span>
                          <br />
                          <HR />
                          <br />
                          <Flex flexFlow="row" align="center" justify="space-between">
                            <h6>Total Amount</h6>
                            <span>{total}</span>
                          </Flex>
                          <br />
                          <HR />
                          <br />
                        </>
                      )}
                      <Flex align="center" justify="flex-end" gap={16}>
                        <Button btnType="outlined" onClick={() => onCustomClose(false)}>
                          Cancel
                        </Button>
                        <Button btnType="accent" type="submit" disabled={hasErrors()}>
                          Send Escrow
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
    </div>
  );
}

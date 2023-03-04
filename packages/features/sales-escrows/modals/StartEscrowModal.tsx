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
  handleClose: any;
  onSuccess: any;
};

type FormValues = {
  token: Token;
  amount: number;
  fee: number;
  total: number;
};

type FormErrors = {
  token: string;
  amount: string;
};

export function StartEscrowModal({
  odc,
  escrowType,
  open,
  handleClose,
  onSuccess,
}: StartEscrowModalProps) {
  const debug = useDebug();
  const { actor, principal, activeWalletProvider } = React.useContext(AuthContext);
  const { tokens, refreshAllBalances } = useTokensContext();
  const { enqueueSnackbar } = useSnackbar() || {};

  const [isLoading, setIsLoading] = React.useState(true);
  const [isTransacting, setIsTransacting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [formValues, setFormValues] = React.useState<FormValues>();
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
      const fee = toLargerUnit(token.fee, token.decimals);
      const total = getTotal(amount, token);

      setFormValues({ ...formValues, amount, token, fee, total });
      setIsLoading(false);
    }
  }, [open]);

  const onTokenChanged = (tokenSymbol?: any) => {
    const token = tokens[tokenSymbol];
    const fee = toLargerUnit(token.fee, token.decimals);
    const total = getTotal(formValues.amount, token);
    setFormValues({ ...formValues, token, fee, total });
    setFormErrors({ ...formErrors, token: undefined });
  };

  const onAmountChanged = (enteredAmount: string) => {
    let amount = 0;
    let isValid = true;
    if (enteredAmount.trim()) {
      isValid = enteredAmount.trim() && isPositiveFloat(enteredAmount.trim());
      amount = isValid ? parseFloat(enteredAmount) : 0;
    }

    if (isValid) {
      const total = getTotal(amount, formValues.token);
      setFormValues({ ...formValues, amount, total });
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
    const amount = formValues.amount;

    // && amount > tokens[formValues.token.symbol].fee

    console.log('token2', tokens[formValues.token.symbol].fee)

    if (isNaN(amount)) {
      errors = { ...errors, amount: `${escrowType} must be a number` };
    } else if (amount <= 0 ) {
      errors = { ...errors, amount: `${escrowType} must be greater than 0` };
    } else if ( amount < tokens[formValues.token.symbol].fee) {
      errors = { ...errors, amount: `${escrowType} must be greater than the fee` };
    } else if (escrowType == 'Bid') {
      const minBid = (odc.currentBid + Number(odc.minIncreaseAmount)) / 1e8;
      if (amount < minBid) {
        errors = { ...errors, amount: `The minimum bid is ${minBid} ${odc.tokenSymbol}` };
      }
    } else if (escrowType === 'Offer' && amount <= odc.startPrice / 1e8 ) {
      const startPrice = toLargerUnit(odc.startPrice, Number(odc.token.decimals));
      errors = {
        ...errors,
        amount: `Offer must be greater than the start price of ${startPrice} ${odc.tokenSymbol}`,
      };
    }

    if (!formValues.token) {
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
      if (isLoading || isTransacting || !activeWalletProvider || hasErrors() || !validateForm()) {
        console.log('validation failed');
        return;
      }

      setIsTransacting(true);

      const amount = toSmallerUnit(formValues.amount, formValues.token.decimals);

      // gets the deposit info for the account number of the caller
      const saleInfo = await actor.sale_info_nft_origyn({ deposit_info: [] });

      if (debug) {
        console.log('>>>>> return value of actor.sale_info_nft_origyn({ deposit_info: [] })');
        console.log(JSON.stringify(saleInfo, null, 2));
      }

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
        tokens[formValues.token.symbol],
        account_id,
        amount + formValues.token.fee,
      );

      if (transactionHeight.err) {
        throw Error(transactionHeight.err);
      }

      const escrowData = {
        token_id: odc.id,
        deposit: {
          token: {
            ic: {
              fee: BigInt(formValues.token.fee ?? 200_000),
              decimals: BigInt(formValues.token.decimals ?? 8),
              canister: Principal.fromText(formValues.token.canisterId),
              standard: { Ledger: null },
              symbol: formValues.token.symbol,
            },
          },
          trx_id: [{ nat: BigInt(transactionHeight.ok) }],
          seller: { principal: Principal.fromText(odc.ownerPrincipalId) },
          buyer: { principal },
          amount: BigInt(amount),
          sale_id: odc.saleId ? [odc.saleId] : [],
        },
        lock_to_date: [],
      };

      if (debug) {
        console.log(
          '>>>>> escrowData sent to actor.sale_nft_origyn({ escrow_deposit: escrowData })',
        );
        console.log(JSON.stringify(escrowData, null, 2));
      }

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

        if (debug) {
          console.log('>>>>> bidData sent to actor.sale_nft_origyn({ bid: bidData })');
          console.log(JSON.stringify(bidData, null, 2));
          console.log('>>>>> response from actor.sale_nft_origyn({ bid: bidData })');
          console.log(JSON.stringify(bidResponse, null, 2));
        }

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
        handleCustomClose(true);
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
        handleCustomClose(true);
        refreshAllBalances(false, principal);
        setSuccess(true);
        onSuccess();
      }
    } catch (e) {
      console.log(e);
      enqueueSnackbar(`Error: ${e?.message ?? e}.`, {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
    } finally {
      setIsTransacting(false);
    }
  };

  const handleCustomClose = (value: any) => {
    setIsLoading(false);
    setIsTransacting(false);
    setSuccess(false);
    handleClose(value);
  };

  const onFormSubmitted = async (e: any) => {
    e.preventDefault();
    startEscrow();
  };

  return (
    <div>
      <Modal isOpened={open} closeModal={() => handleCustomClose} size="md">
        <Container as="form" onSubmit={onFormSubmitted} size="full" padding="48px" smPadding="8px">
          {success ? (
            <>
              <h2>Success!</h2>
              <p className="secondary_color">All the transactions were made successfully.</p>
              <Flex justify="flex-end">
                <Button onClick={handleCustomClose}>Done</Button>
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
                            label: formValues.token.symbol,
                            value: formValues.token.symbol,
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
                          <span style={{ color: 'grey' }}>{formValues.token.symbol}</span>
                        </>
                      )}
                      {escrowType == 'BuyNow' ? (
                        <>
                          <br />
                          <span>Buy Now Price (in {formValues.token.symbol})</span>
                          <span style={{ color: 'grey' }}>
                            {toLargerUnit(odc.buyNow, formValues.token.decimals)}
                          </span>
                        </>
                      ) : (
                        <>
                          <br />
                          <TextInput
                            required
                            label={`Your ${escrowType === 'Bid' ? 'bid' : 'offer'} (in ${
                              formValues.token.symbol
                            })`}
                            id="offerPrice"
                            name="offerPrice"
                            error={formErrors.amount}
                            onChange={(e) => onAmountChanged(e.target.value)}
                          />
                        </>
                      )}
                      <br />
                      {formValues.token && (
                        <>
                          <span>Transaction Fee</span>
                          <span style={{ color: 'grey' }}>{`${formValues.fee}${' '}${
                            formValues.token?.symbol
                          }`}</span>
                          <br />
                          <HR />
                          <br />
                          <Flex flexFlow="row" align="center" justify="space-between">
                            <h6>Total Amount</h6>
                            <span>{formValues.total}</span>
                          </Flex>
                          <br />
                          <HR />
                          <br />
                        </>
                      )}
                      <Flex align="center" justify="flex-end" gap={16}>
                        <Button btnType="outlined" onClick={() => handleCustomClose(false)}>
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

import { AuthContext } from '@dapp/features-authentication';
import { LoadingContainer } from '@dapp/features-components';
import { sendTransaction, useTokensContext, Token } from '@dapp/features-tokens-provider';
import { Principal } from '@dfinity/principal';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { Modal, Container, TextInput, Flex, Select, Button, HR } from '@origyn-sa/origyn-art-ui';
import { useEffect } from 'react';
import { currencyToFixed, OdcDataWithSale } from '@dapp/utils';

export type EscrowType = 'BuyNow' | 'Bid' | 'Offer';

export type StartEscrowModalProps = {
  odc: OdcDataWithSale;
  escrowType: EscrowType;
  open: boolean;
  handleClose: any;
  onSuccess: any;
};

type FormValues = {
  offerPrice: string;
  token: Token;
};

type FormErrors = {
  offerPrice: string;
  token: string;
};

export function StartEscrowModal({
  odc,
  escrowType,
  open,
  handleClose,
  onSuccess,
}: StartEscrowModalProps) {
  const { actor, principal, activeWalletProvider } = React.useContext(AuthContext);
  const { tokens, refreshAllBalances } = useTokensContext();
  const { enqueueSnackbar } = useSnackbar() || {};

  const [isLoading, setIsLoading] = React.useState(true);
  const [isTransacting, setIsTransacting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [formValues, setFormValues] = React.useState<FormValues>();
  const [formErrors, setFormErrors] = React.useState<FormErrors>({
    offerPrice: '',
    token: '',
  });

  const handleCustomClose = (value: any) => {
    setIsLoading(false);
    setIsTransacting(false);
    setSuccess(false);
    handleClose(value);
  };

  const onTokenChanged = (tokenSymbol?: any) => {
    setFormErrors({ ...formErrors, token: undefined });
    setFormValues({ ...formValues, token: tokens[tokenSymbol] });
  };

  const onOfferChanged = (value?: any) => {
    setFormErrors({ ...formErrors, offerPrice: undefined });
    setFormValues({ ...formValues, offerPrice: value });
  };

  useEffect(() => {
    // initialize form values
    if (odc && tokens) {
      let minOffer = 0;
      if (escrowType === 'BuyNow') {
        minOffer = odc.buyNow;
      } else if (escrowType === 'Bid') {
        minOffer =
          odc.currentBid > 0 ? odc.currentBid + Number(odc.minIncreaseAmount) : odc.startPrice;
      }

      setFormValues({
        offerPrice: currencyToFixed(minOffer, Number(odc.token.decimals)),
        token: tokens[odc.token.symbol],
      });

      setIsLoading(false);
    }
  }, [odc, tokens]);

  const validateForm = () => {
    let errors = { offerPrice: '', token: undefined };

    if (isNaN(parseFloat(formValues.offerPrice))) {
      errors = { ...errors, offerPrice: 'Offer must be a number' };
    } else if (parseFloat(formValues.offerPrice) <= 0) {
      errors = { ...errors, offerPrice: 'Offer must be greater than 0' };
    } else if (parseFloat(formValues.offerPrice) <= odc.startPrice / 1e8) {
      errors = {
        ...errors,
        offerPrice: `Offer must be greater than the start price of ${currencyToFixed(
          odc.startPrice,
          Number(odc.token.decimals),
        )} ${odc.tokenSymbol}`,
      };
    }

    if (!formValues.token) {
      errors = { ...errors, token: 'No token selected' };
    }

    // if there are any form errors, notify the user
    if (errors.offerPrice || errors.token) {
      setFormErrors(errors);
      return false;
    }

    return true;
  };

  const startEscrow = async () => {
    try {
      if (isLoading || isTransacting || !activeWalletProvider || !validateForm()) {
        console.log('validation failed');
        return;
      }

      setIsTransacting(true);

      const offer = Number(formValues.offerPrice) * 1e8;

      // gets the deposit info for the account number of the caller
      const saleInfo = await actor.sale_info_nft_origyn({ deposit_info: [] });

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
        offer + formValues.token.fee,
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
          amount: BigInt(offer),
          sale_id: odc?.saleId ? [odc.saleId] : [],
        },
        lock_to_date: [],
      };

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
                      <TextInput
                        required
                        label={`Your ${escrowType === 'Bid' ? 'bid' : 'offer'} (in tokens)`}
                        id="offerPrice"
                        name="offerPrice"
                        error={formErrors.offerPrice}
                        value={formValues.offerPrice}
                        onChange={(e) => onOfferChanged(e.target.value)}
                      />
                      <br />
                      {formValues.token && (
                        <>
                          <span>Transaction Fee</span>
                          <span style={{ color: 'grey' }}>{`${
                            formValues.token.fee * 0.00000001
                          }${' '}${formValues.token?.symbol}`}</span>
                          <br />
                          <HR />
                          <br />
                          <Flex flexFlow="row" align="center" justify="space-between">
                            <h6>Total Amount</h6>
                            <span>
                              {parseFloat(formValues.offerPrice) +
                                formValues.token.fee * 0.00000001}
                            </span>
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
                        <Button btnType="accent" type="submit">
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

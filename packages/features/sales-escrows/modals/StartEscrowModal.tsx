import { AuthContext } from '@dapp/features-authentication';
import { LoadingContainer } from '@dapp/features-components';
import { sendTransaction, useTokensContext } from '@dapp/features-tokens-provider';
import { Principal } from '@dfinity/principal';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import * as Yup from 'yup';
import { Modal, Container, TextInput, Flex, Select, Button, HR } from '@origyn-sa/origyn-art-ui';
import { useEffect } from 'react';

const validationSchema = Yup.object({
  escrowPrice: Yup.number()
    .typeError('This must be a number')
    .nullable()
    .typeError('This cannot be a nullable number')
    .moreThan(Yup.ref('startPrice'), 'Instant buy price must be greater than the start price'),
});

export function StartEscrowModal({ nft, open, handleClose, initialValues, onSuccess }: any) {
  const { actor, principal, activeWalletProvider } = React.useContext(AuthContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [errors, setErrors] = React.useState<any>({});
  const [values, setValues] = React.useState<any>({
    nftId: nft?.metadata?.Class?.find(({ name }) => name === 'id').value.Text,
    seller: nft?.metadata?.Class?.find(({ name }) => name === 'owner').value.Principal.toText(),
    token:
      nft?.current_sale?.length > 0
        ? nft?.current_sale[0].sale_type?.auction?.config?.auction?.token?.ic?.symbol
        : 'OGY',
    openAuction: nft?.current_sale?.find((sale) =>
      sale?.sale_type?.auction?.status?.hasOwnProperty('open'),
    ),
  });
  const { enqueueSnackbar } = useSnackbar() || {};
  const { tokens, refreshAllBalances } = useTokensContext();

  const handleCustomClose = (value: any) => {
    handleClose(value);
  };

  const handleStartEscrow = async (data) => {
    if (
      isNaN(parseFloat(data.priceOffer)) ||
      data.sellerId === 'undefined' ||
      data.nftId === 'undefined'
    ) {
      enqueueSnackbar('Error: Fill all fields correctly', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
      return;
    }
    if (isLoading) return;

    if (activeWalletProvider) {
      setIsLoading(true);
      const amount = data.priceOffer * 1e8;
      const saleInfo = await actor.sale_info_nft_origyn({ deposit_info: [] });

      if ('err' in saleInfo) throw new Error(Object.keys(saleInfo.err)[0]);

      if (!('deposit_info' in saleInfo.ok)) throw new Error();

      const { account_id } = saleInfo?.ok?.deposit_info ?? {};

      try {
        const transactionHeight = await sendTransaction(
          false,
          activeWalletProvider,
          tokens[values.token],
          account_id,
          amount + tokens[values.token].fee,
        );
        if (transactionHeight.err) {
          setIsLoading(false);
          throw Error(transactionHeight.err);
        }
        const escrowData = {
          token_id: values.nftId,
          deposit: {
            token: {
              ic: {
                fee: BigInt(tokens[values.token].fee ?? 200_000),
                decimals: BigInt(tokens[values.token].decimals ?? 8),
                canister: Principal.fromText(tokens[values.token].canisterId),
                standard: { Ledger: null },
                symbol: tokens[values.token].symbol,
              },
            },
            trx_id: [{ nat: BigInt(transactionHeight.ok) }],
            seller: {
              principal: Principal.fromText(values.seller),
            },
            buyer: { principal },
            amount: BigInt(amount),
            sale_id: values?.openAuction?.sale_id ? [values?.openAuction?.sale_id] : [],
          },
          lock_to_date: [],
        };
        try {
          const escrowResponse = await actor.sale_nft_origyn({ escrow_deposit: escrowData });
          if ('err' in escrowResponse) throw new Error(Object.keys(escrowResponse.err)[0]);

          if (!values.openAuction) {
            enqueueSnackbar('Your escrow has been successfully sent.', {
              variant: 'success',
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
            });
            setIsLoading(false);
            handleCustomClose(true);
            refreshAllBalances(false, principal);
            setSuccess(true);
            onSuccess();
          } else {
            const bidData = {
              broker_id: [],
              escrow_receipt: escrowResponse?.ok?.escrow_deposit.receipt,
              sale_id: values.openAuction?.sale_id,
            };

            const bidResponse = await actor.sale_nft_origyn({ bid: bidData }); // TODO: fix this

            if ('err' in bidResponse) throw new Error(Object.keys(bidResponse.err)[0]);
            enqueueSnackbar('Your bid has been successfully placed.', {
              variant: 'success',
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
            });
            setIsLoading(false);
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
        }
        setIsLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const getValidationErrors = (err) => {
    const validationErrors = {};

    err.inner.forEach((error) => {
      if (error.path) {
        validationErrors[error.path] = error.message;
      }
    });

    return validationErrors;
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    validationSchema
      .validate(values, { abortEarly: false })
      .then(() => {
        handleStartEscrow(values);
      })
      .catch(function (e) {
        console.log(e);
        const errs = getValidationErrors(e);
        setErrors(errs);
      });
  };
  const onChange = (e?: any, name?: string, value?: any) => {
    setErrors({ ...errors, [name || e.target.name]: undefined });
    setValues({ ...values, [name || e.target.name]: value || e.target.value });
  };
  useEffect(() => {
    setValues({
      ...initialValues,
      nftId: nft?.metadata?.Class?.find(({ name }) => name === 'id').value.Text,
      seller: nft?.metadata?.Class?.find(({ name }) => name === 'owner').value.Principal.toText(),
      token:
        nft?.current_sale?.length > 0
          ? nft?.current_sale[0].sale_type?.auction?.config?.auction?.token?.ic?.symbol
          : 'OGY',
      openAuction: nft?.current_sale?.find((sale) =>
        sale?.sale_type?.auction?.status?.hasOwnProperty('open'),
      ),
    });
  }, [nft, initialValues]);
  return (
    <div>
      <Modal isOpened={open} closeModal={() => handleClose(false)} size="md">
        <Container as="form" onSubmit={handleSubmit} size="full" padding="48px" smPadding="8px">
          {success ? (
            <>
              <h2>Success!</h2>
              <p className="secondary_color">All the transactions were made successfully.</p>
              <Flex justify="flex-end">
                <Button onClick={handleClose}>Done</Button>
              </Flex>
            </>
          ) : (
            <>
              {isLoading ? (
                <>
                  <h2>Transactions in Progress</h2>
                  <br />
                  <LoadingContainer data-testid="loading-container" />
                </>
              ) : (
                <>
                  <h2>
                    Send escrow for <strong>{values.nftId}</strong>?
                  </h2>
                  <br />
                  <Flex flexFlow="column" gap={8}>
                    <Select
                      name="token"
                      selectedOption={{ label: values.token, value: values.token }}
                      handleChange={(opt) => onChange(null, 'token', opt.value)}
                      label="Token"
                      options={Object.keys(tokens).map((t) => ({
                        label: tokens[t].symbol,
                        value: t,
                      }))}
                    />
                    <TextInput
                      required
                      label="Your Offer (in tokens)"
                      id="priceOffer"
                      name="priceOffer"
                      error={errors.priceOffer}
                      value={values.priceOffer}
                      onChange={onChange}
                    />
                    <br />
                    <span>Transaction Fee</span>
                    <span style={{ color: 'grey' }}>{`${
                      tokens[values.token].fee * 0.00000001
                    }${' '}${tokens[values.token].symbol}`}</span>
                    <br />
                    <HR />
                    <br />
                    <Flex flexFlow="row" align="center" justify="space-between">
                      <h6>Total Amount</h6>
                      <span>
                        {parseFloat(values.priceOffer) + tokens[values.token].fee * 0.00000001}
                      </span>
                    </Flex>
                    <br />
                    <HR />
                    <br />
                    <Flex align="center" justify="flex-end" gap={16}>
                      <Button btnType="outlined" onClick={() => handleCustomClose(false)}>
                        Cancel
                      </Button>
                      <Button btnType="accent" type="submit">
                        Send Escrow
                      </Button>
                    </Flex>
                  </Flex>
                </>
              )}
            </>
          )}
        </Container>
      </Modal>
    </div>
  );
}

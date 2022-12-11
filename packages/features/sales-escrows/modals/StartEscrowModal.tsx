import { AuthContext } from '@dapp/features-authentication';
import { LoadingContainer, TokenIcon } from '@dapp/features-components';
import { sendTransaction, useTokensContext } from '@dapp/features-tokens-provider';
import { isLocal } from '@dapp/utils';
import { Principal } from '@dfinity/principal';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import * as Yup from 'yup';

export function StartEscrowModal({ nft, open, handleClose, initialValues = undefined }: any) {
  const { actor, principal, activeWalletProvider } =
    React.useContext(AuthContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const [token, setToken] = React.useState('OGY');
  const [searchParams, setSearchParams] = useSearchParams({});
  const { enqueueSnackbar } = useSnackbar() || {};
  const { tokens, refreshAllBalances } = useTokensContext();
  const validationSchema = Yup.object().shape({
    nftId: Yup.string().required(),
    escrowPrice: Yup.number()
      .typeError('This must be a number')
      .nullable()
      .typeError('This cannot be a nullable number')
      .moreThan(Yup.ref('startPrice'), 'Instant buy price must be greater than the start price'),
  });

  const handleCustomClose = (value: any) => {
    setSearchParams(searchParams);
    handleClose(value);
  };
  const {
    register,
    getValues,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: React.useMemo(() => initialValues, [initialValues]),
  });

  React.useEffect(() => {
    reset(initialValues);
    const params = getValues();
    setSearchParams(params);
  }, [initialValues]);

  const customSubmit = (data) => {
    handleStartEscrow(data);
  };
  React.useEffect(() => {
    const subscription = watch(() => {
      const params = getValues();
      setSearchParams(params);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  React.useEffect(() => {
    const params = getValues();
    if (open && params.priceOffer) {
      setSearchParams(params);
    }
  }, [open]);
  const _nft = {
    id: nft?.metadata?.Class?.find(({ name }) => name === 'id').value.Text,
    seller: nft?.metadata?.Class?.find(({ name }) => name === 'owner').value.Principal.toText(),
    token:
      nft?.current_sale?.length > 0
        ? nft?.current_sale[0].sale_type?.auction?.config?.auction?.token?.ic?.symbol
        : 'OGY',

    openAuction: nft?.current_sale?.find((sale) =>
      sale?.sale_type?.auction?.status?.hasOwnProperty('open'),
    ),
  };

  const handleStartEscrow = async (data) => {
    console.log(data);
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

      if ('err' in saleInfo)
        throw new Error(Object.keys(saleInfo.err)[0]);

      if (!('deposit_info' in saleInfo.ok))
        throw new Error();

      const { account_id } = saleInfo?.ok?.deposit_info ?? {};
      console.log(tokens[token]);
      const amountWithFee = amount + tokens[token].fee;
      console.log(
        '🚀 ~ file: StartEscrowModal.tsx ~ line 121 ~ handleStartEscrow ~ amountWithFee',
        amountWithFee,
      );
      try {
        const transactionHeight = await sendTransaction(
          false,
          activeWalletProvider,
          tokens[token],
          new Uint8Array(account_id),
          amount + tokens[token].fee,
        );
        if (transactionHeight.err) {
          setIsLoading(false);
          throw Error(transactionHeight.err);
        }
        const escrowData = {
          token_id: _nft.id,
          deposit: {
            token: {
              ic: {
                fee: BigInt(tokens[token].fee ?? 200_000),
                decimals: BigInt(tokens[token].decimals ?? 8),
                canister: Principal.fromText(
                  isLocal ? tokens[token].localCanisterId : tokens[token].canisterId,
                ),
                standard: { Ledger: null },
                symbol: tokens[token].symbol,
              },
            },
            trx_id: [{ nat: BigInt(transactionHeight.ok) }],
            seller: {
              principal: Principal.fromText(_nft.seller),
            },
            buyer: { principal },
            amount: BigInt(amount),
            sale_id: _nft?.openAuction?.sale_id ? [_nft?.openAuction?.sale_id] : [],
          },
          trx_id: [{ nat: BigInt(transactionHeight.ok) }],
          seller: {
            principal: Principal.fromText(_nft.seller),
          },
          buyer: { principal },
          amount: BigInt(amount),
          sale_id: _nft?.openAuction?.sale_id ? [_nft?.openAuction?.sale_id] : [],
          lock_to_date: [],
        }
        try {
          const escrowResponse = await actor.sale_nft_origyn({ escrow_deposit: escrowData });

          if ('err' in escrowResponse)
            throw new Error(Object.keys(escrowResponse.err)[0]);

          if (!_nft.openAuction) {
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
          } else {
            console.log('escrowResponse', escrowResponse);

            if (!('receipt' in escrowResponse.ok))
              throw new Error();

            const bidData = {
              broker_id: [],
              escrow_receipt: escrowResponse?.ok?.escrow_deposit.receipt,
              sale_id: _nft.openAuction?.sale_id,
            };
            const bidResponse = await actor.sale_nft_origyn({ bid: bidData } as any); // TODO: fix this

            if ('err' in bidResponse)
              throw new Error(Object.keys(bidResponse.err)[0]);
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
          }
        } catch (e) {
          console.log(e?.message ?? e);

          enqueueSnackbar(`Error: ${e?.message ?? e}.`, {
            variant: 'error',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
          });
        }
        setIsLoading(false);
      }  catch (e) {
        console.log(e);
      }
    }
  };
  return (
    <div>
      <Dialog
        open={open}
        onClose={() => handleCustomClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Send escrow for <strong>{_nft.id}</strong>?
        </DialogTitle>
        <DialogContent style={{ opacity: isLoading ? '0.4' : '1' }}>
          <Grid container spacing={3} mt={2}>
            <Grid item xs={12} sm={12}>
              <TextField
                required
                label="NFT ID"
                fullWidth
                id="nftId"
                variant="outlined"
                inputProps={{ 'aria-label': 'nftId' }}
                value={_nft.id}
                {...register('nftId')}
                error={!!errors.nftId}
              />
              <Typography variant="inherit" color="textSecondary">
                {errors.nftId?.message}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={12}>
              <TextField
                required
                label="Seller"
                fullWidth
                id="sellerId"
                inputProps={{ 'aria-label': 'sellerId' }}
                variant="outlined"
                value={_nft.seller}
                {...register('sellerId')}
                error={!!errors.sellerId}
              />
              <Typography variant="inherit" color="textSecondary">
                {errors.sellerId?.message}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={12}>
              <TextField
                required
                label="Your Offer (in tokens)"
                fullWidth
                id="priceOffer"
                inputProps={{ 'aria-label': 'priceOffer' }}
                variant="outlined"
                {...register('priceOffer')}
                error={!!errors.priceOffer}
              />
              <Typography variant="inherit" color="textSecondary">
                {errors.priceOffer?.message}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={12}>
              <FormControl fullWidth>
                <InputLabel id="token-select-label">Token</InputLabel>
                <Select
                  labelId="token-select-label"
                  id="token-select"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  label="Token"
                >
                  {Object.keys(tokens).map((t, index) => (
                    <MenuItem key={`${t}+${index}`} value={t}>
                      <TokenIcon symbol={tokens[t].icon} />
                      {tokens[t].symbol}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          {isLoading && (
            <div style={{ marginTop: 5 }}>
              <LoadingContainer data-testid="loading-container" />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCustomClose(false)}>Cancel</Button>
          <Button onClick={handleSubmit(customSubmit)} autoFocus>
            Send Escrow
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

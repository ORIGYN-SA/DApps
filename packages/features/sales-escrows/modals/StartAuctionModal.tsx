import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Principal } from '@dfinity/principal';
import DialogTitle from '@mui/material/DialogTitle';
import { AuthContext } from '@dapp/features-authentication';
import {
  Backdrop,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Grid,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { TokenIcon } from '@dapp/features-components';
import { useTokensContext } from '@dapp/features-tokens-provider';

export function StartAuctionModal({ currentToken, open, handleClose }: any) {
  const { actor } = React.useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const [token, setToken] = React.useState('OGY');
  const [inProgress, setInProgress] = React.useState(false);
  const [buyNowPrice, setBuyNowPrice] = React.useState<any>();
  const [startPrice, setStartPrice] = React.useState<any>();
  const [priceStep, setPriceStep] = React.useState<any>();
  const [endDate, setEndDate] = React.useState<any>(new Date().toJSON().slice(0, 19));
  const { tokens } = useTokensContext();

  const handleChange = (event) => {
    setToken(event.target.value as string);
  };

  const handleStartAuction = async ({
    startPrice,
    buyNowPrice,
    minIncrease: priceStep,
    endDate,
  }) => {
    setInProgress(true);
    try {
      const resp = await actor.market_transfer_nft_origyn({
        token_id: currentToken?.Class?.find(({ name }) => name === 'id').value.Text,
        sales_config: {
          pricing: {
            auction: {
              start_price: BigInt(startPrice * 1e8),
              token: {
                ic: {
                  fee: BigInt(tokens[token]?.fee ?? 200000),
                  decimals: BigInt(tokens[token]?.decimals ?? 8),
                  canister: Principal.fromText(tokens[token]?.canisterId),
                  standard: { Ledger: null },
                  symbol: tokens[token]?.symbol,
                },
              },
              reserve: [],
              start_date: BigInt(Math.floor(new Date().getTime() * 1e6)),
              min_increase: {
                amount: BigInt(priceStep * 1e8),
              },
              allow_list: [],
              buy_now: [BigInt(buyNowPrice * 1e8)],
              end_date: BigInt(new Date(endDate).getTime() * 1e6),
              ending: {
                date: BigInt(new Date(endDate).getTime() * 1e6),
              },
            },
          },
          broker_id: [],
          escrow_receipt: [],
        },
      });
      if (resp.ok) {
        enqueueSnackbar('Your auction has been started.', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
        handleClose(true);
      } else {
        enqueueSnackbar('There was an error when starting your auction.', {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
      }
    } catch (e) {
      console.log(e);
      enqueueSnackbar('There was an error when starting your auction.', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
    }
    setInProgress(false);
  };
  const validationSchema = Yup.object().shape({
    startPrice: Yup.number()
      .typeError('This must be a number')
      .nullable()
      .typeError('This cannot be a nullable number'),
    minIncrease: Yup.string().required('Minimum increase step is required'),
    buyNowPrice: Yup.number()
      .typeError('This must be a number')
      .nullable()
      .typeError('This cannot be a nullable number')
      .moreThan(Yup.ref('startPrice'), 'Instant buy price must be greater than the start price'),
    endDate: Yup.date().min(new Date(), 'The end date needs to be in the future!'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const customSubmit = (data) => {
    handleStartAuction(data);
  };
  return (
    <div>
      <Dialog
        open={open}
        onClose={() => handleClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Start auction for {currentToken?.Class?.find(({ name }) => name === 'id').value.Text}?
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} mt={2}>
            <Grid item xs={12} sm={12}>
              <TextField
                required
                label="Start Price"
                fullWidth
                id="startPrice"
                variant="outlined"
                value={startPrice}
                onChange={(e) => setStartPrice(e.target.value)}
                {...register('startPrice')}
                error={!!errors.startPrice}
              />
              <Typography variant="inherit" color="textSecondary">
                {errors.startPrice?.message}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                required
                label="Min Increase"
                fullWidth
                id="minIncrease"
                variant="outlined"
                value={priceStep}
                onChange={(e) => setPriceStep(e.target.value)}
                {...register('minIncrease')}
                error={!!errors.minIncrease}
              />
              <Typography variant="inherit" color="textSecondary">
                {errors.minIncrease?.message}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={12}>
              <TextField
                required
                label="Buy Now Price"
                fullWidth
                id="outlined-basic"
                variant="outlined"
                value={buyNowPrice}
                onChange={(e) => setBuyNowPrice(e.target.value)}
                {...register('buyNowPrice')}
                error={!!errors.buyNowPrice}
              />
              <Typography variant="inherit" color="textSecondary">
                {errors.buyNowPrice?.message}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={12}>
              <LocalizationProvider fullWidth dateAdapter={AdapterMoment}>
                <DateTimePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => {
                    setEndDate(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} {...register('endDate')} error={!!errors.endDate} />
                  )}
                />
              </LocalizationProvider>
              <Typography variant="inherit" color="textSecondary">
                {errors.endDate?.message}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={12}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Token</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={token}
                  label="Token"
                  onChange={handleChange}
                >
                  {Object.keys(tokens).map((t, index) => (
                    <MenuItem key={`${token}+${index}`} value={t}>
                      <TokenIcon symbol={tokens[t].icon} />
                      {tokens[t].symbol}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(false)}>Cancel</Button>
          <Button onClick={handleSubmit(customSubmit)} autoFocus>
            Start
          </Button>
        </DialogActions>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={inProgress}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Dialog>
    </div>
  );
}

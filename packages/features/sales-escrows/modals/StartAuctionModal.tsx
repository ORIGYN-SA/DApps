import * as React from 'react';
import Button from '@mui/material/Button';
import { Principal } from '@dfinity/principal';
import { AuthContext } from '@dapp/features-authentication';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
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
import { Container, Flex, HR, Modal, TextInput } from '@origyn-sa/origyn-art-ui'

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
              // end_date: BigInt(new Date(endDate).getTime() * 1e6), TODO: figure this out
              ending: {
                date: BigInt(new Date(endDate).getTime() * 1e6),
              },
            },
          },
          broker_id: [],
          escrow_receipt: [],
        },
      });

      if ('err' in resp) {
        enqueueSnackbar('There was an error when starting your auction.', {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
      } else {
        enqueueSnackbar('Your auction has been started.', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
        handleClose(true);
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
      <Modal
        isOpened={open}
        closeModal={() => handleClose(false)}
        size="md"
      >
        <Container size='full' padding='48px'>
          <h2>Start an Auction</h2>
          <br/>
          <Flex flexFlow="column" gap={8}>
            <TextInput
              required
              label="Start Price"
              id="startPrice"
              value={startPrice}
              onChange={(e) => setStartPrice(e.target.value)}
              error={errors?.startPrice?.message as string || ""}
            />
            <TextInput
              required
              label="Min Increase"
              id="minIncrease"
              value={priceStep}
              onChange={(e) => setPriceStep(e.target.value)}
              error={errors?.minIncrease?.message as string || ""}
            />
            <TextInput
              required
              label="Buy Now Price"
              id="outlined-basic"
              value={buyNowPrice}
              onChange={(e) => setBuyNowPrice(e.target.value)}
              error={errors?.buyNowPrice?.message as string || ""}
            />
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
            <HR color='MID_GREY'/>
            <Flex>
              <Button onClick={() => handleClose(false)}>Cancel</Button>
              <Button onClick={handleSubmit(customSubmit)} autoFocus>
                Start
              </Button>
            </Flex>
          </Flex>
        </Container>
      </Modal>
    </div>
  );
}

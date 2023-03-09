import React from 'react';
import { Principal } from '@dfinity/principal';
import { AuthContext } from '@dapp/features-authentication';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { useTokensContext } from '@dapp/features-tokens-provider';
import {
  Container,
  Flex,
  HR,
  Modal,
  TextInput,
  DatePicker,
  Select,
  Button,
} from '@origyn-sa/origyn-art-ui';
import { LinearProgress } from '@mui/material';
import { toSmallerUnit } from '@dapp/utils';
import { MarketTransferRequest } from '@dapp/common-types';
import { useDebug } from '@dapp/features-debug-provider';

const dateNow = new Date();
const dateTomorrow = new Date(new Date().valueOf() + 1000 * 3600 * 23);

const validationSchema = Yup.object({
  token: Yup.string().default('OGY'),
  startPrice: Yup.number()
    .typeError('This must be a number')
    .nullable()
    .typeError('This cannot be a nullable number')
    .required('Start Price is required')
    .default(0),
  minIncrease: Yup.number()
    .typeError('This must be a number')
    .nullable()
    .required('Minimum increase step is required')
    .default(0),
  reservePrice: Yup.number().typeError('This must be a number').nullable().default(0),
  buyNowPrice: Yup.number()
    .typeError('This must be a number')
    .nullable()
    .moreThan(Yup.ref('startPrice'), 'Instant buy price must be greater than the start price')
    .default(0),
  endDate: Yup.date()
    .min(dateTomorrow, 'The end date needs to be at least one day after start date')
    .default(dateNow),
});

interface StartAuctionModalProps {
  currentToken: string;
  open: boolean;
  onClose: () => void;
  onSuccess: (any) => Promise<void>;
  onProcessing: (boolean) => void;
}

export function StartAuctionModal({
  currentToken,
  open,
  onClose,
  onSuccess,
  onProcessing,
}: StartAuctionModalProps) {
  const debug = useDebug();
  const { actor } = React.useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const [errors, setErrors] = React.useState<any>({});
  // const [tokenID, setTokenID] = useState<any>();
  // @ts-ignore
  const [values, setValues] = React.useState<any>(validationSchema.default());
  const [inProgress, setInProgress] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const { tokens, activeTokens } = useTokensContext();

  const onStartAuction = async ({
    startPrice,
    buyNowPrice,
    reservePrice,
    minIncrease: priceStep,
    endDate,
    token: saleToken,
  }) => {
    try {
      setInProgress(true);
      onProcessing(true);

      const token = tokens[saleToken];

      const marketTransferRequest: MarketTransferRequest = {
        token_id: currentToken,
        sales_config: {
          pricing: {
            auction: {
              start_price: BigInt(toSmallerUnit(startPrice, token.decimals)),
              token: {
                ic: {
                  fee: BigInt(token.fee),
                  decimals: BigInt(token.decimals),
                  canister: Principal.fromText(tokens[saleToken]?.canisterId),
                  standard: { Ledger: null },
                  symbol: tokens[saleToken]?.symbol,
                },
              },
              reserve: [BigInt(toSmallerUnit(reservePrice, token.decimals))],
              start_date: BigInt(Math.floor(new Date().getTime() * 1e6)),
              min_increase: {
                amount: BigInt(toSmallerUnit(priceStep, token.decimals)),
              },
              allow_list: [],
              buy_now: [BigInt(toSmallerUnit(buyNowPrice, token.decimals))],
              ending: {
                date: BigInt(endDate.getTime() * 1e6),
              },
            },
          },
          broker_id: [],
          escrow_receipt: [],
        },
      };

      debug.log('marketTransferRequest', marketTransferRequest);

      const resp = await actor.market_transfer_nft_origyn(marketTransferRequest);

      debug.log(resp);

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
        onSuccess(resp.ok);
        setSuccess(true);
      }
    } catch (e) {
      debug.log(e);
      enqueueSnackbar('There was an error when starting your auction.', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
    } finally {
      setInProgress(false);
      onProcessing(false);
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
  const onSubmit = (e: any) => {
    e.preventDefault();
    validationSchema
      .validate(values, { abortEarly: false })
      .then(() => {
        onStartAuction(values);
      })
      .catch(function (e) {
        const errs = getValidationErrors(e);
        setErrors(errs);
      });
  };
  const onChange = (e?: any, name?: string, value?: any) => {
    setErrors({ ...errors, [name || e.target.name]: undefined });
    setValues({ ...values, [name || e.target.name]: value || e.target.value });
  };

  return (
    <div>
      <Modal isOpened={open} closeModal={() => onClose()} size="md">
        <Container size="full" padding="48px">
          {success ? (
            <>
              <h2>Success!</h2>
              <br />
              <p className="secondary_color">
                Your auction has started. Click done to view the status.
              </p>
              <br />
              <Flex justify="flex-end">
                <Button onClick={onClose}>Done</Button>
              </Flex>
            </>
          ) : (
            <>
              {inProgress ? (
                <>
                  <h2>Start an Auction in Progress</h2>
                  <br />
                  <LinearProgress color="secondary" />
                </>
              ) : (
                <>
                  <h2>Start an Auction</h2>
                  <br />
                  <Flex as="form" onSubmit={onSubmit} action="" flexFlow="column" gap={8}>
                    <Select
                      label="Token"
                      name="token"
                      /*@ts-ignore*/
                      selectedOption={{ label: values.token, value: values.token }}
                      handleChange={(v) => onChange(null, 'token', v.value)}
                      options={Object.keys(activeTokens).map((t) => ({
                        label: activeTokens[t].symbol,
                        value: t,
                      }))}
                    />
                    <TextInput
                      required
                      label="Starting Price"
                      name="startPrice"
                      value={values.startPrice}
                      onChange={onChange}
                      error={errors?.startPrice}
                    />
                    <TextInput
                      label="Buy Now Price"
                      name="buyNowPrice"
                      value={values.buyNowPrice}
                      onChange={onChange}
                      error={errors?.buyNowPrice}
                    />
                    <TextInput
                      required
                      label="Minimum Increase"
                      name="minIncrease"
                      value={values.minIncrease}
                      onChange={onChange}
                      error={errors?.minIncrease}
                    />
                    <TextInput
                      label="Reserve Price"
                      name="reservePrice"
                      value={values.reservePrice}
                      onChange={onChange}
                      error={errors?.reservePrice}
                    />
                    <LocalizationProvider fullWidth dateAdapter={AdapterMoment}>
                      <DatePicker
                        label="Set Auction Length"
                        name="endDate"
                        selected={values.endDate}
                        onChange={(d) => onChange(null, 'endDate', d)}
                        error={errors?.endDate}
                      />
                    </LocalizationProvider>
                    <br />
                    <HR />
                    <Flex align="center" justify="flex-end" gap={16}>
                      <Button onClick={() => onClose()}>Cancel</Button>
                      <Button type="submit">Start</Button>
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

import React from 'react';
import { Principal } from '@dfinity/principal';
import { AuthContext } from '@dapp/features-authentication';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
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
  LoadingBar,
} from '@origyn/origyn-art-ui';
import { toSmallerUnit, validateTokenAmount } from '@dapp/utils';
import { MarketTransferRequest } from '@origyn/mintjs';
import { useDebug } from '@dapp/features-debug-provider';
import { useUserMessages } from '@dapp/features-user-messages';
import { ERROR, SUCCESS, VALIDATION } from '../constants';
import { TokenIcon } from '@dapp/features-components';

const dateNow = new Date();
const dateTomorrow = new Date(new Date().valueOf() + 1000 * 3600 * 23);

const validationSchema = Yup.object({
  token: Yup.string().default('OGY'),
  startPrice: Yup.number()
    .typeError(VALIDATION.notANumber)
    .nullable()
    .typeError(VALIDATION.notANullableNumber)
    .required(VALIDATION.startPriceRequired)
    .test('startPriceGreaterThanZero', VALIDATION.startPriceGreaterThanZero, function (value) {
      return value > 0;
    }),
  minIncrease: Yup.number()
    .typeError(VALIDATION.notANumber)
    .nullable()
    .required(VALIDATION.startPriceRequired)
    .default(0),
  reservePrice: Yup.number()
    .typeError(VALIDATION.notANumber)
    .nullable()
    .test(
      'moreThanBuyPrice',
      VALIDATION.reserveBuyPriceGreaterThanBuyNowPrice,
      function (value, { parent }) {
        const buyNowPrice = parent.buyNowPrice;
        if (!value || !buyNowPrice) {
          return true;
        }
        return value < buyNowPrice;
      },
    ),
  buyNowPrice: Yup.number()
    .typeError(VALIDATION.notANumber)
    .nullable()
    .test(
      'moreThanStartPrice',
      VALIDATION.instantBuyPriceSmallerThanStartPrice,
      function (value, { parent }) {
        const startPrice = parent.startPrice;
        if (!value || !startPrice) {
          return true;
        }
        return value > startPrice;
      },
    ),
  endDate: Yup.date().min(dateTomorrow, VALIDATION.endDateSmallerThanStartDate).default(dateNow),
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
  const { showErrorMessage, showSuccessMessage, showUnexpectedErrorMessage } = useUserMessages();
  const { actor } = React.useContext(AuthContext);
  const [errors, setErrors] = React.useState<any>({});
  // @ts-ignore
  const [values, setValues] = React.useState<any>(validationSchema.default());
  const [inProgress, setInProgress] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const { walletTokens, activeTokens } = useTokensContext();

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

      const token = walletTokens[saleToken];

      /*@ts-ignore*/
      let buyNowArray: [bigint] = [];
      if (buyNowPrice > 0) {
        buyNowArray = [BigInt(toSmallerUnit(buyNowPrice, token.decimals).toString())];
      }

      /*@ts-ignore*/
      let reservePriceArray: [bigint] = [];
      if (reservePrice > 0) {
        reservePriceArray = [BigInt(toSmallerUnit(reservePrice, token.decimals).toString())];
      }

      const marketTransferRequest: MarketTransferRequest = {
        token_id: currentToken,
        sales_config: {
          pricing: {
            auction: {
              start_price: BigInt(toSmallerUnit(startPrice, token.decimals).toString()),
              token: {
                ic: {
                  id: [],
                  fee: [BigInt(token.fee)],
                  decimals: BigInt(token.decimals),
                  canister: Principal.fromText(walletTokens[saleToken]?.canisterId),
                  standard: { Ledger: null },
                  symbol: walletTokens[saleToken]?.symbol,
                },
              },
              reserve: reservePriceArray,
              start_date: BigInt(Math.floor(new Date().getTime() * 1e6)),
              min_increase: {
                amount: BigInt(toSmallerUnit(priceStep, token.decimals).toString()),
              },
              allow_list: [],
              buy_now: buyNowArray,
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
        showErrorMessage(ERROR.auction, resp.err);
      } else {
        showSuccessMessage(SUCCESS.auction);
        onSuccess(resp.ok);
        setSuccess(true);
      }
    } catch (e) {
      showUnexpectedErrorMessage(e);
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

  const onCurrencyChanged = (name: string, value: string) => {
    let validationMsg = validateTokenAmount(value, walletTokens[values.token].decimals);
    setErrors({ ...errors, [name]: validationMsg });
    setValues({ ...values, [name]: value });
  };

  return (
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
              <Button onClick={() => onClose()}>Done</Button>
            </Flex>
          </>
        ) : (
          <>
            {inProgress ? (
              <>
                <h2>Start an Auction in Progress</h2>
                <br />
                <Flex justify="center" align="center">
                  <LoadingBar />
                </Flex>
              </>
            ) : (
              <>
                <h2>Start an Auction</h2>
                <br />
                <Flex as="form" onSubmit={onSubmit} action="" flexFlow="column" gap={8}>
                  <Select
                    label="Token*"
                    name="token"
                    /*@ts-ignore*/
                    selectedOption={{
                      /*@ts-ignore*/
                      label: (
                        <>
                          <TokenIcon symbol={values.token} /> {values.token}
                        </>
                      ),
                      value: values.token,
                    }}
                    handleChange={(v) => onChange(null, 'token', v.value)}
                    options={Object.keys(activeTokens).map((t) => ({
                      label: (
                        <>
                          <TokenIcon symbol={activeTokens[t].symbol} /> {activeTokens[t].symbol}
                        </>
                      ),
                      value: t,
                    }))}
                  />
                  <TextInput
                    required
                    label="Starting Price*"
                    name="startPrice"
                    placeholder="0"
                    value={values.startPrice}
                    onChange={(e) => onCurrencyChanged('startPrice', e.target.value)}
                    error={errors?.startPrice}
                  />
                  <TextInput
                    label="Reserve Price"
                    optional="(Optional)"
                    name="reservePrice"
                    placeholder="0"
                    value={values.reservePrice}
                    onChange={(e) => onCurrencyChanged('reservePrice', e.target.value)}
                    error={errors?.reservePrice}
                  />
                  <TextInput
                    label="Buy Now Price"
                    optional="(Optional)"
                    name="buyNowPrice"
                    placeholder="0"
                    value={values.buyNowPrice}
                    onChange={(e) => onCurrencyChanged('buyNowPrice', e.target.value)}
                    error={errors?.buyNowPrice}
                  />
                  <TextInput
                    required
                    label="Minimum Increase"
                    optional="(Optional)"
                    name="minIncrease"
                    placeholder="0"
                    value={values.minIncrease}
                    onChange={(e) => onCurrencyChanged('minIncrease', e.target.value)}
                    error={errors?.minIncrease}
                  />
                  <LocalizationProvider fullWidth dateAdapter={AdapterMoment}>
                    <DatePicker
                      label="Set Auction Length*"
                      name="endDate"
                      selected={values.endDate}
                      onChange={(d) => onChange(null, 'endDate', d)}
                      error={errors?.endDate}
                    />
                  </LocalizationProvider>

                  <br />
                  <HR />
                  <Flex align="center" justify="flex-end" gap={16}>
                    <Button btnType="filled" type="submit">
                      Submit
                    </Button>
                  </Flex>
                </Flex>
              </>
            )}
          </>
        )}
      </Container>
    </Modal>
  );
}

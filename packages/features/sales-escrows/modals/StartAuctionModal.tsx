import React, {useEffect, useState} from 'react'
import { Principal } from '@dfinity/principal'
import { AuthContext } from '@dapp/features-authentication'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { useSnackbar } from 'notistack'
import * as Yup from 'yup'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { useTokensContext } from '@dapp/features-tokens-provider'
import { Container, Flex, HR, Modal, TextInput, DatePicker, Select, Button } from '@origyn-sa/origyn-art-ui'
import { useRoute } from '@dapp/features-authentication'
import { LinearProgress } from '@mui/material'

const validationSchema = Yup.object({
  token: Yup.string()
    .default("OGY"),
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
  reservePrice:Yup.number()
  .typeError('This must be a number')
  .nullable()
  .default(0),
  buyNowPrice: Yup.number()
    .typeError('This must be a number')
    .nullable()
    .moreThan(Yup.ref('startPrice'), 'Instant buy price must be greater than the start price')
    .default(0),
  endDate: Yup.date().min(new Date(), 'The end date needs to be in the future!').default(new Date()),
})

export function StartAuctionModal({ currentToken, open, handleClose }: any) {
  const { actor } = React.useContext(AuthContext)
  const { enqueueSnackbar } = useSnackbar()
  const [errors, setErrors] = React.useState<any>({})
const [tokenID, setTokenID] = useState<any>()
  // @ts-ignore
  const [values, setValues] = React.useState<any>(validationSchema.default());
  const [inProgress, setInProgress] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const { tokens, activeTokens } = useTokensContext();

  const handleStartAuction = async ({
                                      startPrice,
                                      buyNowPrice,
                                      reservePrice,
                                      minIncrease: priceStep,
                                      endDate,
                                      token: saleToken
                                    }) => {
    setInProgress(true)
    try {
      const resp = await actor.market_transfer_nft_origyn({
        token_id: currentToken,  
        sales_config: {
          pricing: {
            auction: {
              start_price: BigInt(startPrice * 1e8),
              token: {
                ic: {
                  fee: BigInt(tokens[saleToken]?.fee ?? 200000),
                  decimals: BigInt(tokens[saleToken]?.decimals ?? 8),
                  canister: Principal.fromText(tokens[saleToken]?.canisterId),
                  standard: { Ledger: null },
                  symbol: tokens[saleToken]?.symbol,
                },
              },
              reserve: [BigInt(reservePrice * 1e8)],
              start_date: BigInt(Math.floor(new Date().getTime() * 1e6)),
              min_increase: {
                amount: BigInt(priceStep * 1e8),
              },
              allow_list: [],
              buy_now: [BigInt(buyNowPrice * 1e8)],
              // end_date: BigInt(new Date(endDate).getTime() * 1e6), TODO: figure this out
              ending: {
                date: BigInt(endDate.getTime() * 1e6),
              },
            },
          },
          broker_id: [],
          escrow_receipt: [],
        },
      })
      console.log(resp);
      if ('err' in resp) {
        enqueueSnackbar('There was an error when starting your auction.', {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        })
      } else {
        enqueueSnackbar('Your auction has been started.', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        })
        setSuccess(true)
      }
    } catch (e) {
      console.log('this ie error', e.message)
      enqueueSnackbar('There was an error when starting your auction.', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      })
    }
    setInProgress(false)
  }

  const getValidationErrors = (err) => {
    const validationErrors = {}

    err.inner.forEach(error => {
      if (error.path) {
        validationErrors[error.path] = error.message
      }
    })

    return validationErrors
  }
  const handleSubmit = (e: any) => {
    e.preventDefault()
    validationSchema.validate(values, { abortEarly: false }).then((v) => {
      handleStartAuction(values);
    })
      .catch(function(e) {
        const errs = getValidationErrors(e);
        setErrors(errs)
      })
  }
  const onChange = (e?: any, name?: string, value?: any) => {
    setErrors({...errors, [name || e.target.name]: undefined});
    setValues({...values, [name || e.target.name]: value || e.target.value});
  }

  return (
    <div>
      <Modal
        isOpened={open}
        closeModal={() => handleClose(false)}
        size='md'
      >
        <Container size='full' padding='48px'>
          {
            success ? (
              <>
                <h2>Success!</h2>
                <br />
                <p className="secondary_color">Your auction has started. Click done to view the status.</p>
                <br/>
                <Flex justify="flex-end">
                  <Button onClick={handleClose}>Done</Button>
                </Flex>
              </>
            ) : (
              <>
                {inProgress ? (
                  <>
                    <h2>Transfer in Progress</h2>
                    <br />
                    <LinearProgress color='secondary' />
                  </>
                ) : (
                  <>
                    <h2>Start an Auction</h2>
                    <br />
                    <Flex as='form' onSubmit={handleSubmit} action='' flexFlow='column' gap={8}>
                      <Select
                        label='Token'
                        name='token'
                        /*@ts-ignore*/
                        selectedOption={{ label: values.token, value: values.token }}
                        handleChange={(v) => onChange(null, 'token', v.value)}
                        options={Object.keys(activeTokens).map((t) => ({ label: activeTokens[t].symbol, value: t }))}
                      />
                      <TextInput
                        required
                        label='Starting Price'
                        name='startPrice'
                        type='number'
                        value={values.startPrice}
                        onChange={onChange}
                        error={errors?.startPrice}
                      />
                      <TextInput
                        label='Buy Now Price'
                        name='buyNowPrice'
                        type='number'
                        value={values.buyNowPrice}
                        onChange={onChange}
                        error={errors?.buyNowPrice}
                      />
                      <TextInput
                        required
                        type='number'
                        label='Minimum Increase'
                        name='minIncrease'
                        value={values.minIncrease}
                        onChange={onChange}
                        error={errors?.minIncrease}
                      />
                      <TextInput
                        type='number'
                        label='Reserve Price'
                        name='reservePrice'
                        value={values.reservePrice}
                        onChange={onChange}
                        error={errors?.reservePrice}
                      />
                      <LocalizationProvider fullWidth dateAdapter={AdapterMoment}>
                        <DatePicker
                          label='Set Auction Length'
                          name='endDate'
                          selected={values.endDate}
                          onChange={(d) => onChange(null, 'endDate', d)}
                          error={errors?.endDate}
                        />
                      </LocalizationProvider>
                      <br/>
                      <HR />
                      <Flex align="center" justify="flex-end" gap={16}>
                        <Button onClick={() => handleClose(false)}>Cancel</Button>
                        <Button type='submit'>
                          Start
                        </Button>
                      </Flex>
                    </Flex>
                  </>
                )}
              </>
            )
          }
        </Container>
      </Modal>
    </div>
  )
}

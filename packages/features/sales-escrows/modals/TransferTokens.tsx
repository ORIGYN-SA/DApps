import React, { useContext, useEffect, useState } from 'react'
import { sendTransaction, useTokensContext } from '@dapp/features-tokens-provider'
import { Container, Flex, HR, Modal, TextInput, Select, Button } from '@origyn-sa/origyn-art-ui'
import { LinearProgress } from '@mui/material'
import * as Yup from 'yup'
import { AuthContext } from '../../authentication'
import { useSnackbar } from 'notistack'
import { isLocal } from '../../../utils'

const validationSchema = Yup.object().shape({
  amount: Yup.number()
    .typeError('This must be a number')
    .nullable()
    .required('An amount is required!')
    .default(0),
  recipientAddress: Yup.string()
    .typeError('This must be a principal')
    .required('Recipient address is required!'),
  memo: Yup.string().default(''),
  token: Yup.string().default('OGY'),
})

const TransferTokensModal = ({ open, handleClose }: any) => {
  const { tokens } = useTokensContext()
  const { activeWalletProvider } = useContext(AuthContext)
  const { enqueueSnackbar } = useSnackbar()
  const [selectedToken, setSelectedToken] = useState('OGY')
  const [switchTransfer, setSwitchTransfer] = useState(false)
  // @ts-ignore
  const [values, setValues] = React.useState<any>(validationSchema.default())
  const [errors, setErrors] = React.useState<any>({})
  const [totalAmount, setTotalAmount] = useState(0)


  const onChange = (e?: any, name?: string, value?: any) => {
    setErrors({ ...errors, [name || e.target.name]: undefined })
    setValues({ ...values, [name || e.target.name]: value || e.target.value })
  }

  const sendTrx = (data) => {
    setSwitchTransfer(true)
    console.log(data);
    sendTransaction(isLocal(), activeWalletProvider.meta.name, tokens[data.token], data.recipientAddress, data.amount, data.memo)
      .catch((e) => {
        console.error(e);
        setSwitchTransfer(false);
        enqueueSnackbar('There was an error when starting your auction.', {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
      })
      .then(() => {
        setSwitchTransfer(false)
      })
      .finally(() => {
        setSwitchTransfer(false)
      })
  }

  //   <Container size='full' padding='48px'>
  //             <h2>Success!</h2>
  //             <br/>
  //             <span>Your transfer of {amount} {selectedToken} in complete.
  //             Click done to return to the dashboard.</span>
  //             <br/>
  //             <Button btnType="secondary" onClick={() => handleClose(false)}>Done</Button>

  //        </Container>

  // const {
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<any>({
  //   resolver: yupResolver(validationSchema),
  // });
  // const customSubmit = (data) => {
  //   sendTrx(data);
  // };

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
      sendTrx(values)
    })
      .catch(function(e) {
        const errs = getValidationErrors(e)
        setErrors(errs)
      })
  }

  return (
    <div>
      <Modal isOpened={open} closeModal={() => handleClose(false)} size='md'>
        {switchTransfer ? (
          <Container size='full' padding='48px'>
            <h2>Transfer in Progress</h2>
            <br />
            <LinearProgress color='secondary' />
          </Container>
        ) : (
          <Container as='form' onSubmit={handleSubmit} size='full' padding='48px'>
            <h2>Transfer Tokens</h2>
            <br />
            <Flex flexFlow='column' gap={8}>
              <br />
              <span>Select token</span>
              <Select
                placeholder='OGY'
                handleChange={(option) => {
                  onChange(null, 'token', option.value)
                }}
                options={Object.keys(tokens).map((standard) => ({
                  value: standard,
                  label: standard,
                }))}
              />
              <br />
              <Flex flexFlow='row' justify='space-between'>
                <span>Amount</span>
                <span id='balance'>{tokens[selectedToken].balance}</span>
              </Flex>
              <TextInput
                name='amount'
                type='number'
                onChange={onChange}
                value={values?.amount}
                error={errors?.amount}
              />
              <br />
              <span>Recipient Address</span>
              <TextInput
                name='recipientAddress'
                onChange={onChange}
                value={values.recipientAddress}
                error={errors.recipientAddress}
              />
              <br />
              <span>Memo</span>
              <TextInput
                name='memo'
                value={values.memo}
                onChange={onChange}
              />
              <br />
              <span>Transaction Fee</span>
              <span style={{ color: 'grey' }}>{`${tokens[selectedToken].fee * 0.00000001}${' '}${
                tokens[selectedToken].symbol
              }`}</span>
              <br />
            </Flex>
            <HR />
            <br />
            <Flex flexFlow='row' justify='space-between'>
              <h3>Total Amount</h3>
              <span>{totalAmount}</span>
            </Flex>
            <br />
            <HR />
            <br />
            <Flex justify='flex-end'>
              <Button btnType='secondary' type='submit'>
                Transfer OGY
              </Button>
            </Flex>
          </Container>
        )}
      </Modal>
    </div>
  )
}

export default TransferTokensModal

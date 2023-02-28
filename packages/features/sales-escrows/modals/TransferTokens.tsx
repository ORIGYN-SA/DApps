import React, { useContext, useEffect, useState } from 'react';
import { sendTransaction, useTokensContext } from '@dapp/features-tokens-provider';
import { Container, Flex, HR, Modal, TextInput, Select, Button } from '@origyn-sa/origyn-art-ui';
import { LinearProgress } from '@mui/material';
import * as Yup from 'yup';
import { AuthContext } from '../../authentication';
import { useSnackbar } from 'notistack';
import { isLocal } from '../../../utils';

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
});

const TransferTokensModal = ({ open, handleClose }: any) => {
  const { tokens, activeTokens } = useTokensContext();
  const { activeWalletProvider } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const [switchTransfer, setSwitchTransfer] = useState(false);
  // @ts-ignore
  const [values, setValues] = React.useState<any>(validationSchema.default());
  const [errors, setErrors] = React.useState<any>({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [success, setSuccess] = useState(false);

  const onChange = (e?: any, name?: string, value?: any) => {
    setErrors({ ...errors, [name || e.target.name]: undefined });
    setValues({ ...values, [name || e.target.name]: value || e.target.value });
  };

  const sendTrx = (data) => {
    setSwitchTransfer(true);
    const total = data.amount * 1e8;
    sendTransaction(
      isLocal(),
      activeWalletProvider,
      tokens[data.token],
      data.recipientAddress,
      total,
      data.memo,
    )
      .then(() => {
        setSuccess(true);
      })
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
        setSwitchTransfer(false);
      })
      .finally(() => {
        setSwitchTransfer(false);
      });
  };

  //   <Container size='full' padding='48px'>
  //             <h2>Success!</h2>
  //             <br/>
  //             <span>Your transfer of {amount} {selectedToken} is complete.
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
        sendTrx(values);
      })
      .catch(function (e) {
        const errs = getValidationErrors(e);
        setErrors(errs);
        setSuccess(false);
      });
  };

  //   const total = values.amount * 1e8 + tokens[values.token].fee
  // setTotalAmount(total)

  const handleSuccess = () => {
    handleClose(false);
    setSuccess(false);
  };
  const [tokenFee, setTokenFee] = useState('OGY');

  useEffect(() => {
    const total = Number(values.amount) + tokens[values.token].fee * 0.00000001;
    setTotalAmount(total);
    setTokenFee(values.token);
  }, [onChange]);

  return (
    <div>
      <Modal isOpened={open} closeModal={() => handleClose(false)} size="md">
        {success ? (
          <Container size="full" padding="48px">
            <h2>Success!</h2>
            <br />
            <span>
              Your transfer of {totalAmount} {tokenFee} is complete. Click done to return to the
              dashboard.
            </span>
            <br />
            <br />
            <Button btnType="filled" onClick={handleSuccess}>
              Done
            </Button>
          </Container>
        ) : switchTransfer ? (
          <Container size="full" padding="48px">
            <h2>Transfer in Progress</h2>
            <br />
            <LinearProgress color="secondary" />
          </Container>
        ) : (
          <Container as="form" onSubmit={handleSubmit} size="full" padding="48px">
            <h2>Transfer Tokens</h2>
            <br />
            <Flex flexFlow="column" gap={8}>
              <br />
              <span>Select token</span>
              <Select
                placeholder="OGY"
                handleChange={(option) => {
                  onChange(null, 'token', option.value);
                }}
                options={Object.keys(activeTokens).map((standard) => ({
                  value: standard,
                  label: standard,
                }))}
              />
              <br />
              <Flex flexFlow="row" justify="space-between">
                <span>Amount</span>
                <span id="balance">{tokens[tokenFee]?.balance}</span>
              </Flex>
              <TextInput
                name="amount"
                onChange={onChange}
                value={values?.amount}
                error={errors?.amount}
              />
              <br />
              <span>Recipient Address</span>
              <TextInput
                name="recipientAddress"
                onChange={onChange}
                value={values.recipientAddress}
                error={errors.recipientAddress}
              />
              <br />
              <span>Memo</span>
              <TextInput name="memo" value={values.memo} onChange={onChange} />
              <br />
              <span>Transaction Fee</span>
              <span style={{ color: 'grey' }}>{`${tokens[tokenFee].fee * 0.00000001}${' '}${
                tokens[tokenFee].symbol
              }`}</span>
              <br />
            </Flex>
            <br />
            <HR />
            <br />
            <Flex flexFlow="row" align="center" justify="space-between">
              <h6>Total Amount</h6>
              <span>{totalAmount}</span>
            </Flex>
            <br />
            <HR />
            <br />
            <Flex justify="flex-end">
              <Button btnType="filled" type="submit">
                Transfer {tokenFee}
              </Button>
            </Flex>
          </Container>
        )}
      </Modal>
    </div>
  );
};

export default TransferTokensModal;

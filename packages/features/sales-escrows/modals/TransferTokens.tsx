import React, { useContext, useEffect, useState } from 'react';
import { Principal } from '@dfinity/principal';
import { sendTransaction, useTokensContext } from '@dapp/features-tokens-provider';
import { Container, Flex, HR, Modal, TextInput, Select, Button } from '@origyn/origyn-art-ui';
import { LinearProgress } from '@mui/material';
import * as Yup from 'yup';
import { AuthContext } from '@dapp/features-authentication';
import {
  isLocal,
  validateTokenAmount,
  toSmallerUnit,
  toLargerUnit,
  toBigNumber,
  getAccountId,
} from '@dapp/utils';
import { useUserMessages } from '@dapp/features-user-messages';

const validationSchema = Yup.object().shape({
  amount: Yup.number()
    .typeError('This must be a number')
    .nullable()
    .required('An amount is required!')
    .default(0),
  recipientAddress: Yup.string()
    .typeError('This must be a principal or account number')
    .required('Recipient address is required!')
    .default(''),
  memo: Yup.string().default(''),
  token: Yup.string().default('OGY'),
});

const TransferTokensModal = ({ open, handleClose }: any) => {
  const { tokens, activeTokens } = useTokensContext();
  const { showErrorMessage, showUnexpectedErrorMessage } = useUserMessages();
  const { activeWalletProvider } = useContext(AuthContext);
  const [inProcess, setInProcess] = useState(false);
  // @ts-ignore
  const [values, setValues] = React.useState<any>(validationSchema.default());
  const [errors, setErrors] = React.useState<any>({});
  const [displayAmount, setDisplayAmount] = useState('0');
  const [totalDisplayAmount, setTotalDisplayAmount] = useState('0');
  const [tokenSymbol, setTokenSymbol] = useState('OGY');
  const [tokenFee, setTokenFee] = useState('');
  const [success, setSuccess] = useState(false);

  const onChange = (e?: any, name?: string, value?: any) => {
    setErrors({ ...errors, [name || e.target.name]: undefined });
    setValues({ ...values, [name || e.target.name]: value || e.target.value });
  };

  const onCurrencyChanged = (name: string, value: string) => {
    let validationMsg = validateTokenAmount(value, tokens[values.token].decimals);
    setErrors({ ...errors, [name]: validationMsg });
    setValues({ ...values, [name]: value });
  };

  const sendTrx = async (data) => {
    try {
      console.log(data);
      setInProcess(true);

      const token = tokens[data.token];
      const total = toSmallerUnit(data.amount, token.decimals);
      let address: string = data.recipientAddress;

      // if this is a principal id, convert to an account number
      if (address.includes('-')) {
        address = getAccountId(Principal.fromText(address));
      }

      console.log(`Sending: ${total.toFixed()} ${token.symbol} to ${address}`);

      const result = await sendTransaction(
        isLocal(),
        activeWalletProvider,
        token,
        address,
        total,
        data.memo,
      );

      setInProcess(false);

      if (result.err) {
        showErrorMessage('Token transfer failed', result.err);
      } else {
        setSuccess(true);
      }
    } catch (e) {
      showUnexpectedErrorMessage(e);
    } finally {
      setInProcess(false);
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
        sendTrx(values);
      })
      .catch(function (e) {
        const errs = getValidationErrors(e);
        setErrors(errs);
        setSuccess(false);
      });
  };

  const handleSuccess = () => {
    handleClose(false);
    setSuccess(false);
  };

  useEffect(() => {
    //const total = Number(values.amount) + tokens[values.token].fee * 0.00000001;
    const token = tokens[values.token];
    const amount = toBigNumber(values.amount || 0);
    const fee = toLargerUnit(token.fee, token.decimals);
    const total = amount.plus(fee);

    console.log(
      `token: ${
        token.symbol
      }; amount: ${amount.toFixed()}; fee: ${fee.toFixed()}; total: ${total.toFixed()}`,
    );

    setDisplayAmount(amount.toFixed());
    setTotalDisplayAmount(total.toFixed());
    setTokenFee(toLargerUnit(token.fee, token.decimals).toFixed());
    setTokenSymbol(token.symbol);
  }, [values]);

  useEffect(() => {}, []);

  return (
    <div>
      <Modal isOpened={open} closeModal={() => handleClose(false)} size="md">
        {success ? (
          <Container size="full" padding="48px">
            <h2>Success!</h2>
            <br />
            <span>
              Your transfer of {displayAmount} {tokenSymbol} is complete. Click done to return to
              the dashboard.
            </span>
            <br />
            <br />
            <Button btnType="filled" onClick={handleSuccess}>
              Done
            </Button>
          </Container>
        ) : inProcess ? (
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
                <span id="balance">{tokens[tokenSymbol]?.balance}</span>
              </Flex>
              <TextInput
                name="amount"
                onChange={(e) => onCurrencyChanged('amount', e.target.value)}
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
              <span style={{ color: 'grey' }}>{`${tokenFee}${' '}${tokenSymbol}`}</span>
              <br />
            </Flex>
            <br />
            <HR />
            <br />
            <Flex flexFlow="row" align="center" justify="space-between">
              <h6>Total Amount</h6>
              <span>{totalDisplayAmount}</span>
            </Flex>
            <br />
            <HR />
            <br />
            <Flex justify="flex-end">
              <Button btnType="filled" type="submit">
                Transfer {tokenSymbol}
              </Button>
            </Flex>
          </Container>
        )}
      </Modal>
    </div>
  );
};

export default TransferTokensModal;

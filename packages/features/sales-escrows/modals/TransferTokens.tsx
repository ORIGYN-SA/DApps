import React, { useContext, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { Principal } from '@dfinity/principal';
import { sendTransaction, Token, useTokensContext } from '@dapp/features-tokens-provider';
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
  const [amountDisplay, setAmountDisplay] = useState('0');
  const [totalDisplay, setTotalDisplay] = useState('0');
  const [feeDisplay, setFeeDisplay] = useState('');
  const [success, setSuccess] = useState(false);

  const onChange = (name: string, value: any) => {
    setErrors({ ...errors, [name]: undefined });
    setValues({ ...values, [name]: value });

    if (name === 'amount') {
      onAmountChanged(value);
    } else if (name === 'token') {
      onTokenChanged(value);
    }
  };

  const onAmountChanged = (value: string) => {
    const token = tokens[values.token];
    let validationMsg = validateTokenAmount(value, token.decimals);
    if (validationMsg) {
      setErrors({ ...errors, amount: validationMsg });
    } else {
      const amount = toBigNumber(value || 0);
      updateTotals(token, amount);
    }
  };

  const onTokenChanged = (value: string) => {
    const token = tokens[value];
    const amount = toBigNumber(values.amount || 0);
    updateTotals(token, amount);
  };

  const updateTotals = (token: Token, amount: BigNumber) => {
    const fee = toLargerUnit(token.fee, token.decimals);
    const total = amount.plus(fee);
    setAmountDisplay(amount.toFixed());
    setTotalDisplay(total.toFixed());
    setFeeDisplay(toLargerUnit(token.fee, token.decimals).toFixed());
  };

  const sendTrx = async (data) => {
    try {
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

    // TODO: validate address

    const amount = toBigNumber(values.amount || 0);
    if (amount.isLessThanOrEqualTo(0)) {
      setErrors({ ...errors, amount: 'Amount can not be 0' });
      return;
    }

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
    setValues({ token: 'OGY', amount: '', memo: '', recipientAddress: '' });
  }, [open]);

  const tokenOptions = Object.keys(activeTokens).map((standard) => ({
    value: standard,
    label: standard,
  }));

  return (
    <div>
      <Modal isOpened={open} closeModal={() => handleClose(false)} size="md">
        {success ? (
          <Container size="full" padding="48px">
            <h2>Success!</h2>
            <br />
            <span>
              Your transfer of {amountDisplay} {values.token} is complete. Click done to return to
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
                handleChange={(option) => onChange('token', option.value)}
                options={tokenOptions}
                selectedOption={tokenOptions.find((opt) => opt.label === values.token)}
              />
              <br />
              <Flex flexFlow="row" justify="space-between">
                <span>Amount</span>
                <span id="balance">{tokens[values.token]?.balance}</span>
              </Flex>
              <TextInput
                name="amount"
                onChange={(e) => onChange('amount', e.target.value)}
                value={values?.amount}
                error={errors?.amount}
              />
              <br />
              <span>Recipient Address</span>
              <TextInput
                name="recipientAddress"
                onChange={(e) => onChange('recipientAddress', e.target.value)}
                value={values.recipientAddress}
                error={errors.recipientAddress}
              />
              <br />
              <span>Memo</span>
              <TextInput
                name="memo"
                value={values.memo}
                onChange={(e) => onChange('memo', e.target.value)}
              />
              <br />
              <span>Transaction Fee</span>
              <span style={{ color: 'grey' }}>{`${feeDisplay}${' '}${values.token}`}</span>
              <br />
            </Flex>
            <br />
            <HR />
            <br />
            <Flex flexFlow="row" align="center" justify="space-between">
              <h6>Total Amount</h6>
              <span>{totalDisplay}</span>
            </Flex>
            <br />
            <HR />
            <br />
            <Flex justify="flex-end">
              <Button btnType="filled" type="submit">
                Transfer {values.token}
              </Button>
            </Flex>
          </Container>
        )}
      </Modal>
    </div>
  );
};

export default TransferTokensModal;

import React, { useEffect, useState } from 'react';
import { sendTransaction, useTokensContext } from '@dapp/features-tokens-provider';
import { Container, Flex, HR, Modal, TextInput, Select, Button } from '@origyn-sa/origyn-art-ui';
import { LinearProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const TransferTokensModal = ({ open, handleClose }: any) => {
  const { tokens } = useTokensContext();
  const [selectedToken, setSelectedToken] = useState('OGY');
  const [amount, setAmount] = useState<any>(0);
  const [receiver, setReceiver] = useState<any>();
  const [memo, setMemo] = useState<any>();
  const walletType = localStorage.getItem('loggedIn');
  const [switchTransfer, setSwitchTransfer] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  const sendTrx = (data) => {
    try {
      sendTransaction(data.walletType, data.tokens, data.recipientAddress, data.totalAmount);
      setSwitchTransfer(true);
    } catch (err) {
      setSwitchTransfer(false);
    }
  };

  const data = {
    walletType: walletType,
    tokens: tokens[selectedToken],
    amount: amount,
    recipientAddress: receiver,
    totalAmount: BigInt(totalAmount * 1e8)
  };

  console.log(data);

  //   <Container size='full' padding='48px'>
  //             <h2>Success!</h2>
  //             <br/>
  //             <span>Your transfer of {amount} {selectedToken} in complete.
  //             Click done to return to the dashboard.</span>
  //             <br/>
  //             <Button btnType="secondary" onClick={() => handleClose(false)}>Done</Button>

  //        </Container>

  useEffect(() => {
    setTotalAmount(Number(amount) + tokens[selectedToken].fee * 0.00000001);
  }, [amount]);

  const validationSchema = Yup.object().shape({
    amount: Yup.number()
      .typeError('This must be a number')
      .nullable()
      .typeError('This cannot be a nullable number')
      .lessThan(Yup.ref('balance'), 'Account balance exceeded')
      .required('An amount is required!'),
    recipientAddress: Yup.string()
      .typeError('This must be a principal')
      .min(63, 'Principal invalid')
      .max(63, 'Principal invalid')
      .required('Recipient address is required!'),
  });

  const {
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
  });
  const customSubmit = (data) => {
    sendTrx(data);
  };

  return (
    <div>
      <Modal isOpened={open} closeModal={() => handleClose(false)} size="md">
        {switchTransfer ? (
          <Container size="full" padding="48px">
            <h2>Transfer in Progress</h2>
            <br />
            <LinearProgress color="secondary" />
          </Container>
        ) : (
          <Container size="full" padding="48px">
            <h2>Transfer Tokens</h2>
            <br />
            <span style={{ color: 'grey' }}>
              {' '}
              You can only send OGY from your available balance.
            </span>
            <Flex flexFlow="column" gap={8}>
              <br />
              <span>Select token</span>
              <Select
                placeholder="OGY"
                handleChange={(option) => {
                  setSelectedToken(option.value);
                }}
                options={Object.keys(tokens).map((standard) => ({
                  value: standard,
                  label: standard,
                }))}
              />
              <br />
              <Flex flexFlow="row" justify="space-between">
                <span>Amount</span>
                <span id="balance">{tokens[selectedToken].balance}</span>
              </Flex>
              <TextInput
                id="amount"
                onChange={(e) => setAmount(Number(e.target.value))}
                required
                value={amount}
                error={(errors?.amount?.message as string) || ''}
              />
              <br />
              <span>Recipient Address</span>
              <TextInput
                id="recipientAddress"
                onChange={(e) => setReceiver(e.target.value)}
                required
                value={receiver}
                error={(errors?.recipientAddress?.message as string) || ''}
              />
              <br />
              <span>Memo</span>
              <TextInput
                id="standard-helperText"
                onChange={(e) => setMemo(e.target.value)}
                required
              />
              <br />
              <span>Transaction Fee</span>
              <span style={{ color: 'grey' }}>{`${tokens[selectedToken].fee * 0.00000001}${' '}${
                tokens[selectedToken].symbol
              }`}</span>
              <br />
            </Flex>
            <HR color="DARK_GREY" />
            <br />
            <Flex flexFlow="row" justify="space-between">
              <h3>Total Amount</h3>
              <span>{totalAmount}</span>
            </Flex>
            <br />
            <HR color="DARK_GREY" />
            <br />
            <Flex justify="flex-end">
              <Button btnType="secondary" onClick={handleSubmit(customSubmit)}>
                Transfer OGY
              </Button>
            </Flex>
          </Container>
        )}
      </Modal>
    </div>
  );
};

export default TransferTokensModal;

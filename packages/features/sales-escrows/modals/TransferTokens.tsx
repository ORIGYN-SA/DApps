import React, { useContext, useEffect, useState } from 'react';
import { sendTransaction, useTokensContext } from '@dapp/features-tokens-provider';
import { AuthContext } from '@dapp/features-authentication';
import { Container, Flex, HR, Modal, TextInput, Select, Button } from '@origyn-sa/origyn-art-ui';

const TransferTokensModal = ({ currentToken, open, handleClose }: any) => {
  const { actor, ogyActor, principal } = React.useContext(AuthContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const [token, setToken] = React.useState('OGY');
  const { tokens, refreshAllBalances } = useTokensContext();
  const [selectedToken, setSelectedToken] = useState<any>('OGY');
  const [amount, setAmount] = useState<any>(0);
  const [receiver, setReceiver] = useState<any>();
  const [memo, setMemo] = useState<any>();
  const walletType = localStorage.getItem('loggedIn');
  const [switchTransfer, setSwitchTransfer] = useState(false);

  const sendTrx = () => {
    sendTransaction(walletType, tokens[selectedToken], receiver, amount);
    setSwitchTransfer(true);
  };

  //   <Container size='full' padding='48px'>
  //             <h2>Success!</h2>
  //             <br/>
  //             <span>Your transfer of {amount} {selectedToken} in complete.
  //             Click done to return to the dashboard.</span>
  //             <br/>
  //             <Button btnType="secondary" onClick={() => handleClose(false)}>Done</Button>

  //        </Container>

  return (
    <div>
      <Modal isOpened={open} closeModal={() => handleClose(false)} size="md">
        {switchTransfer ? (
          <Container size="full" padding="48px">
            <h2>Transfer in Progress</h2>
            <br />
            <span>loading bar placeholder</span>
          </Container>
        ) : (
          <Container size="full" padding="48px">
            <h2>Transfer Tokens</h2>
            <br />
            <span> You can only send OGY from your available balance.</span>
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
                <span>{tokens[selectedToken].balance}</span>
              </Flex>
              <TextInput
                id="standard-helperText"
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <br />
              <span>Recipient Address</span>
              <TextInput
                id="standard-helperText"
                onChange={(e) => setReceiver(e.target.value)}
                required
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
              <span>0.002 OGY</span>
              <br />
            </Flex>
            <HR color="DARK_GREY" />
            <br />
            <Flex flexFlow="row" justify="space-between">
              <h3>Total Amount</h3>
              <span>{Number(amount) + 0.002}</span>
            </Flex>
            <br />
            <HR color="DARK_GREY" />
            <br />
            <Flex justify="flex-end">
              <Button btnType="secondary" onClick={sendTrx}>
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

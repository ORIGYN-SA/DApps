import React, { useContext, useEffect, useState } from 'react';
import { sendTransaction, useTokensContext } from '@dapp/features-tokens-provider';
import { AuthContext, useAuthContext, useRoute } from '@dapp/features-authentication';
import { Container, Flex, Modal, Button, Card } from '@origyn-sa/origyn-art-ui';
import { TokenIcon, LoadingContainer } from '@dapp/features-components';

const ManageEscrowsModal = ({ open, handleClose, activeEsc }: any) => {
  const { loggedIn, principal, actor, activeWalletProvider } = useContext(AuthContext)
  const { tokens } = useTokensContext();
  const [selectedEscrow, setSelectedEscrow] = useState<any>();
  const [openConfirmation, setOpenConfirmation] = React.useState(false);
  const [selectdNFT, setSelectdNFT] = React.useState<any>();
  const [dialogAction, setDialogAction] = useState<any>();
  const [openSuccess, setOpenSuccess] = useState(false);

  const [canisterId, setCanisterId] = React.useState("")

  const [escrow, setEscrow] = useState([1, 2, 3]);

  //-----------------
  const Balance = async () => {
    const data = await actor?.balance_of_nft_origyn({ principal });
    const data3 = await data.ok.escrow;
    setEscrow(data3);
    console.log('escrows', data3)
  };



  useEffect(() => {
    useRoute().then(({canisterId, tokenId}) => {
      setCanisterId(canisterId);

    })
  }, [])

  useEffect(() => {
    Balance();
  }, [tokens]);

  //------------------

  const withdrawEscrow = async (escrow) => {
    handleClose(false);
    setOpenConfirmation(true);
    setSelectedEscrow(escrow);
    setDialogAction('withdraw');
    setSelectdNFT(escrow.token_id);
    _handleClose(true);
  };

  const [isLoading, setIsLoading] = React.useState(true);

  const _handleClose = async (confirm = false) => {
    if (confirm && actor) {
      if (isLoading) return;
      setIsLoading(true);
      const tokenId = selectdNFT?.Class?.find(({ name }) => name === 'id').value.Text;

      if (!escrow) {
        return handleClose(false);
      }

      try {
        const withdrawResponse = await actor?.sale_nft_origyn({
          withdraw: {
            escrow: {
              ...selectedEscrow,
              withdraw_to: { principal },
            },
          },
        });

        setIsLoading(false);

        setOpenConfirmation(false);
        setOpenSuccess(true);
      } catch (err) {}
      return handleClose(false);
    }
  };

  console.log('this is true', activeEsc);

  return (
    <div>
      <Modal isOpened={open} closeModal={() => handleClose(false)} size="md">
        <Container size="full" padding="48px">
          <h2>Manage Escrow</h2>
          <br />
          <Card align="center" padding="12px" justify="space-between">
            <Flex gap={8}>
              <TokenIcon symbol={tokens['OGY']?.icon} />
              {tokens['OGY']?.icon}
            </Flex>
            <Flex flexFlow="column" align="flex-end">
              <p>
                <b>
                  {tokens['OGY']?.balance} {tokens['OGY']?.symbol}
                </b>
              </p>
              <p style={{ color: '#9A9A9A' }}>${tokens['OGY']?.balance / 4}</p>
            </Flex>
          </Card>
          <br />

          {escrow.length > 0
            ? escrow.map((esc: any, index) => (
                <>
                  <Flex flexFlow="row" justify="space-around">
                    <img
                      style={{ width: '42px', height: '42px', borderRadius: '12px' }}
                      src={`https://${canisterId}.raw.ic0.app/-/${esc.token_id}/preview`}
                      alt=""
                    />
                    <Flex flexFlow="column">
                      <span>{esc.token_id}</span>
                      <span>bm</span>
                    </Flex>
                    <Flex flexFlow="column">
                      <span>Amount</span>
                      <span>{parseFloat((parseInt(esc.amount) * 1e-8).toString()).toFixed(9)}</span>
                    </Flex>
                    <Flex flexFlow="column">
                      <span>Status</span>
                      <span>{Date.now() * 1e6 > parseInt(esc.ending) ? 'Active' : 'Expired'}</span>
                    </Flex>
                    {Date.now() * 1e6 > parseInt(esc.ending) ? (
                      ''
                    ) : (
                      <Button
                        btnType="secondary"
                        size="small"
                        onClick={() => withdrawEscrow(esc[index])}
                      >
                        Withdraw
                      </Button>
                    )}
                  </Flex>
                  <br />
                  <br />
                </>
              ))
            : 'No escrow available'}
        </Container>
      </Modal>

      <Modal isOpened={openConfirmation} closeModal={() => handleClose(false)} size="md">
        <Container size="full" padding="48px">
          <h3>Withdrawing Escrow...</h3>
          <br />
          <span
            style={{ color: 'gray' }}
          >{`${'Your escrow for '}${selectdNFT}${' is being withdrawn'}`}</span>
          {isLoading && (
            <div style={{ marginTop: 5 }}>
              <LoadingContainer />
            </div>
          )}
        </Container>
      </Modal>

      <Modal isOpened={openSuccess} closeModal={() => handleClose(false)} size="md">
        <Container size="full" padding="48px">
          <h3>Success!</h3>
          <br />
          <span style={{ color: 'gray' }}>Your escrow has been withdrawn successfully</span>
          <Flex align="flex-end">
            <Button btnType="secondary" size="small" onClick={() => setOpenSuccess(false)}>
              Done
            </Button>
          </Flex>
        </Container>
      </Modal>
    </div>
  );
};

export default ManageEscrowsModal;

import React, { useContext, useEffect, useState } from 'react';
import { useTokensContext } from '@dapp/features-tokens-provider';
import { AuthContext,useRoute } from '@dapp/features-authentication';
import { Container, Flex, Modal, Button, Card } from '@origyn-sa/origyn-art-ui';
import { TokenIcon } from '@dapp/features-components';
import { ConfirmSalesActionModal } from './ConfirmSalesActionModal';

const ManageEscrowsModal = ({ open, handleClose, collection}: any) => {
  const { principal, actor} = useContext(AuthContext);
  const { activeTokens } = useTokensContext();
  const [selectedEscrow, setSelectedEscrow] = useState<any>();
  const [openConfirmation, setOpenConfirmation] = React.useState(false);
  const [selectdNFT, setSelectdNFT] = React.useState<any>();
  const [dialogAction, setDialogAction] = useState<any>();
  const [openSuccess, setOpenSuccess] = useState(false);

  const [canisterId, setCanisterId] = React.useState('');
  const [escrow, setEscrow] = useState([]);
  const [offers, setOffers] = useState([]);

  const [totalAm, setTotalAm] = useState()

  //-----------------
  const Balance = async () => {
    const data = await actor?.balance_of_nft_origyn({ principal });

    const data2 = await data.ok.offers;
    const data3 = await data.ok.escrow;
    setOffers(data2);
    setEscrow(data3);
  };

  useEffect(() => {
    useRoute().then(({ canisterId}) => {
      setCanisterId(canisterId);
    });
  }, []);

  const withdrawEscrow = async (escrow, token_id) => {
    setSelectdNFT(token_id)
    setOpenConfirmation(true)
    setSelectedEscrow(escrow)
    setDialogAction('withdraw')
  }

  const handleClickOpen = (token_id) => {
      setOpenConfirmation(true)
      setDialogAction('endSale')
      setSelectdNFT(token_id)
  }
  const handleClickOpenRej = (escrow, token_id) => {
    setOpenConfirmation(true)
    setDialogAction('reject')
    setSelectedEscrow(escrow)
}

  const handleCloseConf = () => {
    setOpenConfirmation(false)
  }
  const totalAmount = async () => {
    const totalEsc = [];
    const totalOffer = [];
    const initialValue = 0;

    escrow.map((esc: any) => (
      totalEsc.push((Number(esc.amount) * 0.00000001))
    ))
    const escrowSum = totalEsc.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      initialValue
    );
  // offers.map((esc: any) => (
  //     totalOffer.push((Number(esc.amount) * 0.00000001))
  //   ))
  // const offerSum = totalOffer.reduce(
  //     (accumulator, currentValue) => accumulator + currentValue,
  //     initialValue
  //   );


    
    
    
    setTotalAm(escrowSum)
  }

  useEffect(() => {
    Balance();
    totalAmount();
  }, [open]);

  console.log(escrow)

  return (
    <div>
      <Modal isOpened={open} closeModal={() => handleClose(false)} size="md">
        <Container size="full" padding="48px">
          <h3>Manage Escrow</h3>
          <br />
          <Card align="center" padding="12px" justify="space-between">
            <Flex gap={8}>
              <TokenIcon symbol={activeTokens['OGY']?.icon} />
              {activeTokens['OGY']?.icon}
            </Flex>
            <Flex flexFlow="column" align="flex-end">
              <p>
                <b>
                  {totalAm} {activeTokens['OGY']?.symbol}
                </b>
              </p>
              {/* <p style={{ color: '#9A9A9A' }}>${activeTokens['OGY']?.balance / 4}</p> */}
            </Flex>
          </Card>
          <br />

          {escrow.length > 0 ? (
            <>
              <h5>Escrows</h5>
              <br />
              {escrow.map((esc: any, index) => (
                <>
                  <Flex flexFlow="row" justify="space-around">
                    <img
                      style={{ width: '42px', height: '42px', borderRadius: '12px' }}
                      src={`https://${canisterId}.raw.ic0.app/-/${esc.token_id}/preview`}
                      alt=""
                    />
                    <Flex flexFlow="column">
                      <span>{esc.token_id}</span>
                      <span style={{color: 'grey'}}>{collection.name}</span>
                    </Flex>
                    <Flex flexFlow="column">
                      <span style={{color: 'grey'}}>Amount</span>
                      <span>{`${(Number(esc.amount) * 0.00000001)}${' '}${esc.token.ic.symbol}`}</span>                  
                    </Flex>
                    <Flex flexFlow="column">
                      <span style={{color: 'grey'}}>Status</span>
                      <span>{esc.lock_to_date ? (Date.now() * 1e6 > parseInt(esc.lock_to_date) ? 'Locked' : 'Done' ) : 'Hey'}</span>
                    </Flex>
                    {Date.now() * 1e6 > parseInt(esc.lock_to_date) ? (
                                            <Button
                                            btnType="filled"
                                            size="small"
                                            onClick={() => withdrawEscrow(esc, esc.token_id)}
                                            disabled
                                          >
                                            Withdraw
                                          </Button>
                    ) : (
                      <Button
                        btnType="filled"
                        size="small"
                        onClick={() => withdrawEscrow(esc, esc.token_id)}
                      >
                        Withdraw
                      </Button>
                    )}
                  </Flex>
                  <br />
                  <br />
                </>
              ))}{' '}
            </>
          ) : (
            ''
          )}

          {offers.length > 0 ? (
            <>
              {' '}
              <h5>Offers</h5>
              <br />
              {offers.map((esc: any, index) => (
                <>
                  <Flex flexFlow="row" justify="space-around">
                    <img
                      style={{ width: '42px', height: '42px', borderRadius: '12px' }}
                      src={`https://${canisterId}.raw.ic0.app/-/${esc.token_id}/preview`}
                      alt=""
                    />
                    <Flex flexFlow="column">
                      <span>{esc.token_id}</span>
                      <span style={{color: 'grey'}}>{collection.name}</span>
                    </Flex>
                    <Flex flexFlow="column">
                      <span style={{color: 'grey'}} >Amount</span>
                      <span>{`${(Number(esc.amount) * 0.00000001)}${' '}${esc.token.ic.symbol}`}</span>                  
                      </Flex>
                    {/* <Button
                        btnType="filled"
                        size="small"
                        onClick={()=>handleClickOpen(esc.token_id)}
                      >
                       Accept
                      </Button> */}
                      <Button
                        btnType="outlined"
                        size="small"
                        onClick={()=>handleClickOpenRej(esc, esc.token_id)}
                      >
                       Reject
                      </Button>
                  </Flex>
                  <br />
                  <br />
                </>
              ))}
            </>
          ) : (
            ''
          )}
        </Container>
      </Modal>

      <ConfirmSalesActionModal
            openConfirmation={openConfirmation}
            handleClose={handleCloseConf}
            currentToken={selectdNFT}
            action={dialogAction}
            escrow={selectedEscrow}
          />

      {/* <Modal isOpened={openConfirmation} closeModal={() => handleClose(false)} size="md">
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
      </Modal> */}

      {/* <Modal isOpened={openSuccess} closeModal={() => handleClose(false)} size="md">
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
      </Modal> */}
    </div>
  );
};

export default ManageEscrowsModal;

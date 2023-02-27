import React, { useContext, useEffect, useState } from 'react';
import { AuthContext, useRoute } from '@dapp/features-authentication';
import { Container, Flex, Modal, Button } from '@origyn-sa/origyn-art-ui';
import { ConfirmSalesActionModal } from './ConfirmSalesActionModal';
import { currencyToFixed } from '@dapp/utils';

const ManageEscrowsModal = ({ open, handleClose, collection }: any) => {
  const { principal, actor } = useContext(AuthContext);
  const [selectedEscrow, setSelectedEscrow] = useState<any>();
  const [selectedOffer, setSelectedOffer] = useState<any>();
  const [openConfirmation, setOpenConfirmation] = React.useState(false);
  const [selectdNFT, setSelectdNFT] = React.useState<any>();
  const [dialogAction, setDialogAction] = useState<any>();

  const [canisterId, setCanisterId] = React.useState('');
  const [escrow, setEscrow] = useState([]);
  const [offers, setOffers] = useState([]);

  // TODO: uncomment when totalAm is used
  // const [totalAm, setTotalAm] = useState();

  //-----------------
  const Balance = async () => {
    const data = await actor?.balance_of_nft_origyn({ principal });

    const data2 = await data.ok.offers;
    const data3 = await data.ok.escrow;
    setOffers(data2);
    setEscrow(data3);
  };

  useEffect(() => {
    useRoute().then(({ canisterId }) => {
      setCanisterId(canisterId);
    });
  }, []);

  const withdrawEscrow = async (escrow, token_id) => {
    setSelectdNFT(token_id);
    setOpenConfirmation(true);
    setSelectedEscrow(escrow);
    setDialogAction('withdraw');
  };

  const handleClickOpen = (offer, token_id) => {
    setOpenConfirmation(true);
    setDialogAction('acceptOffer');
    setSelectdNFT(token_id);
    setSelectedOffer(offer);
  };

  const handleClickOpenRej = (escrow) => {
    setOpenConfirmation(true);
    setDialogAction('reject');
    setSelectedEscrow(escrow);
  };

  const handleCloseConf = () => {
    setOpenConfirmation(false);
  };

  const totalAmount = async () => {
    const totalEsc = [];
    // const initialValue = 0;

    escrow.map((esc: any) => totalEsc.push(Number(esc.amount) * 0.00000001));
    // const escrowSum = totalEsc.reduce(
    //   (accumulator, currentValue) => accumulator + currentValue,
    //   initialValue,
    // );
    // offers.map((esc: any) => (
    //     totalOffer.push((Number(esc.amount) * 0.00000001))
    //   ))
    // const offerSum = totalOffer.reduce(
    //     (accumulator, currentValue) => accumulator + currentValue,
    //     initialValue
    //   );

    // setTotalAm(escrowSum);
  };

  useEffect(() => {
    Balance();
    totalAmount();
  }, [open, withdrawEscrow]);

  return (
    <div>
      <Modal isOpened={open} closeModal={() => handleClose(false)} size="md">
        <Container size="full" padding="48px">
          <h3>Manage Escrow</h3>
          <br />
          <br />

          {escrow.length > 0 ? (
            <>
              <h5>Escrows</h5>
              <br />
              {escrow.map((esc: any, index: number) => (
                <Flex key={index} flexFlow="row" justify="space-around" gap={8}>
                  <img
                    style={{ width: '42px', height: '42px', borderRadius: '12px' }}
                    src={`https://${canisterId}.raw.ic0.app/-/${esc.token_id}/preview`}
                    alt=""
                  />
                  <Flex flexFlow="column" gap={8}>
                    <span>{esc.token_id}</span>
                    <span style={{ color: 'grey' }}>{collection.name}</span>
                  </Flex>
                  <Flex flexFlow="column" gap={8}>
                    <span style={{ color: 'grey' }}>Amount</span>
                    <span>{`${currencyToFixed(
                      Number(esc.amount),
                      Number(esc.token.ic.decimals),
                    )}${' '}${esc.token.ic.symbol}`}</span>
                  </Flex>
                  <Flex flexFlow="column" gap={8}>
                    <span style={{ color: 'grey' }}>Status</span>
                    <span>
                      {esc.lock_to_date
                        ? Date.now() * 1e6 > parseInt(esc.lock_to_date)
                          ? 'Locked'
                          : 'Done'
                        : 'Hey'}
                    </span>
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
              ))}{' '}
            </>
          ) : (
            ''
          )}

          {offers.length > 0 && (
            <>
              {' '}
              <h5>Offers</h5>
              <br />
              {offers.map((esc: any, index: number) => (
                <Flex
                  key={`offers-${index}`}
                  flexFlow="row"
                  justify="space-around"
                  align="flex-start"
                  gap={8}
                >
                  <img
                    style={{ width: '42px', height: '42px', borderRadius: '12px' }}
                    src={`https://${canisterId}.raw.ic0.app/-/${esc.token_id}/preview`}
                    alt=""
                  />
                  <Flex flexFlow="column" gap={8}>
                    <span>{esc.token_id}</span>
                    <span style={{ color: 'grey' }}>{collection.name}</span>
                  </Flex>
                  <Flex flexFlow="column" gap={8}>
                    <span style={{ color: 'grey' }}>Amount</span>
                    <span>{`${currencyToFixed(
                      Number(esc.amount),
                      Number(esc.token.ic.decimals),
                    )}${' '}${esc.token.ic.symbol}`}</span>
                  </Flex>
                  <Flex flexFlow="row" gap={8}>
                    <Button
                      btnType="filled"
                      size="small"
                      onClick={() => handleClickOpen(esc, esc.token_id)}
                    >
                      Accept
                    </Button>
                    <Button btnType="outlined" size="small" onClick={() => handleClickOpenRej(esc)}>
                      Reject
                    </Button>
                  </Flex>
                </Flex>
              ))}
            </>
          )}
        </Container>
      </Modal>

      <ConfirmSalesActionModal
        openConfirmation={openConfirmation}
        handleClose={handleCloseConf}
        currentToken={selectdNFT}
        action={dialogAction}
        escrow={selectedEscrow}
        offer={selectedOffer}
      />
    </div>
  );
};

export default ManageEscrowsModal;

import React, { useContext, useEffect, useState } from 'react';
import { AuthContext, useRoute } from '@dapp/features-authentication';
import { Container, Modal, Button, HR } from '@origyn-sa/origyn-art-ui';
import { ConfirmSalesActionModal } from './ConfirmSalesActionModal';
import { currencyToFixed } from '@dapp/utils';

const styles = {
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: '42px 3fr repeat(3, 1fr)',
    gap: '8px',
    backgroundColor: 'inherit',
    color: 'inherit',
  },
  gridItem: {
    marginBottom: 'auto',
    marginTop: 'auto',
    verticalAlign: 'middle',
  },
};

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
    <>
      <Modal isOpened={open} closeModal={() => handleClose(false)} size="md">
        <Container size="full" padding="48px">
          <h3>Manage Escrow</h3>
          <HR marginTop={16} marginBottom={16} />
          {escrow.length > 0 && (
            <div>
              <div>
                <h5>Escrows</h5>
              </div>
              <HR marginTop={16} marginBottom={16} />
              <div style={styles.gridContainer}>
                {escrow.map((esc: any, index: number) => (
                  <>
                    <div key={index} style={styles.gridItem}>
                      <img
                        style={{
                          width: '42px',
                          borderRadius: '12px',
                          marginTop: 'auto',
                          marginBottom: 'auto',
                        }}
                        src={`https://${canisterId}.raw.ic0.app/-/${esc.token_id}/preview`}
                        alt=""
                      />
                    </div>
                    <div style={styles.gridItem}>
                      <div>
                        <p>{esc.token_id}</p>
                      </div>

                      <span style={{ color: 'grey' }}>{collection.name}</span>
                    </div>
                    <div style={styles.gridItem}>
                      <span style={{ color: 'grey' }}>Amount</span>
                      <br />
                      <div>
                        <span>{`${currencyToFixed(
                          Number(esc.amount),
                          Number(esc.token.ic.decimals),
                        )}${' '}${esc.token.ic.symbol}`}</span>
                      </div>
                    </div>
                    <div style={styles.gridItem}>
                      <span style={{ color: 'grey' }}>Status</span>
                      <br />
                      <span>
                        {esc.lock_to_date
                          ? Date.now() * 1e6 > parseInt(esc.lock_to_date)
                            ? 'Locked'
                            : 'Done'
                          : 'Lock date not present'}
                      </span>
                    </div>
                    <div style={styles.gridItem}>
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
                    </div>
                  </>
                ))}{' '}
              </div>
            </div>
          )}
          <HR marginTop={16} marginBottom={16} />
          {offers.length > 0 && (
            <div>
              <div>
                <h5>Offers</h5>
              </div>
              <HR marginTop={16} marginBottom={16} />
              <div style={styles.gridContainer}>
                {offers.map((esc: any, index: number) => (
                  <>
                    <div style={styles.gridItem}>
                      <img
                        style={{ width: '42px', height: '42px', borderRadius: '12px' }}
                        src={`https://${canisterId}.raw.ic0.app/-/${esc.token_id}/preview`}
                        alt=""
                      />
                    </div>
                    <div style={styles.gridItem}>
                      <span>{esc.token_id}</span>
                      <br />
                      <span style={{ color: 'grey' }}>{collection.name}</span>
                    </div>
                    <div style={styles.gridItem}>
                      <p style={{ color: 'grey' }}>Amount</p>
                      <p>{`${currencyToFixed(
                        Number(esc.amount),
                        Number(esc.token.ic.decimals),
                      )}${' '}${esc.token.ic.symbol}`}</p>
                    </div>
                    <div style={styles.gridItem}>
                      <Button
                        btnType="filled"
                        size="small"
                        onClick={() => handleClickOpen(esc, esc.token_id)}
                      >
                        Accept
                      </Button>
                    </div>
                    <div style={styles.gridItem}>
                      <Button
                        btnType="outlined"
                        size="small"
                        onClick={() => handleClickOpenRej(esc)}
                      >
                        Reject
                      </Button>
                    </div>
                  </>
                ))}
              </div>
            </div>
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
    </>
  );
};

export default ManageEscrowsModal;

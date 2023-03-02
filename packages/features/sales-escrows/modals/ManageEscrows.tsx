import React, { useContext, useEffect, useState } from 'react';
import { useDebug } from '@dapp/features-debug-provider';
import { AuthContext, useRoute } from '@dapp/features-authentication';
import { Container, Modal, HR, TabContent } from '@origyn-sa/origyn-art-ui';
import { ConfirmSalesActionModal } from './ConfirmSalesActionModal';
import { OffersReceivedTab } from '../../../apps/vault/src/components/offersReceivedTab';
import { BidsReceivedTab } from '../../../apps/vault/src/components/bidsReceivedTab';
import { OffersSentTab } from '../../../apps/vault/src/components/offersSentTab';
import { BidsSentTab } from '../../../apps/vault/src/components/bidsSentTab';

const ManageEscrowsModal = ({ open, handleClose, collection }: any) => {
  const debug = useDebug();
  const { principal, actor } = useContext(AuthContext);
  const [selectedEscrow, setSelectedEscrow] = useState<any>();
  const [selectedOffer, setSelectedOffer] = useState<any>();
  const [openConfirmation, setOpenConfirmation] = React.useState(false);
  const [selectdNFT, setSelectdNFT] = React.useState<any>();
  const [dialogAction, setDialogAction] = useState<any>();

  const [canisterId, setCanisterId] = React.useState('');
  const [escrow, setEscrow] = useState([]);
  const [offersReceived, setOffersReceived] = useState([]);
  const [bidsReceived, setBidsReceived] = useState([]);
  const [offersSent, setOffersSent] = useState([]);
  const [bidsSent, setBidsSent] = useState([]);

  // TODO: uncomment when totalAm is used
  // const [totalAm, setTotalAm] = useState();

  //-----------------
  const Balance = async () => {
    const balance = await actor?.balance_of_nft_origyn({ principal });
    debug.log(JSON.stringify(balance, null, 2));

    const offersAndBidsReceived = await balance?.ok.offers;
    const sentEscrows = await balance?.ok.escrow;
    // If there is a sale_id, it means that the Escrow is Associated to a Sale Process
    // and it is a Bid, otherwise it is an Offer
    const bidsReceived = offersAndBidsReceived?.filter((element) => element.sale_id.length > 0);
    const offersReceived = offersAndBidsReceived?.filter((element) => element.sale_id.length === 0);
    const bidsSent = sentEscrows?.filter((element) => element.sale_id.length > 0);
    debug.log('bidsSent', bidsSent);
    const offersSent = sentEscrows?.filter((element) => element.sale_id.length === 0);
    debug.log('offersSent', offersSent);
    setOffersReceived(offersReceived);
    setBidsReceived(bidsReceived);
    setEscrow(sentEscrows);
    setOffersSent(offersSent);
    setBidsSent(bidsSent);
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
          <TabContent
            tabs={[
              {
                title: 'Offers Sent',
                id: 'offersSent',
              },
              {
                title: 'Offers Received',
                id: 'offersReceived',
              },
              {
                title: 'Bids Sent',
                id: 'bidsSent',
              },
              {
                title: 'Bids Received',
                id: 'bidsReceived',
              },
            ]}
            fullWidth={true}
            justify="flex-start"
            content={[
              <OffersSentTab
                offersSent={offersSent}
                collection={collection}
                canisterId={canisterId}
                withdrawEscrow={withdrawEscrow}
              />,
              <OffersReceivedTab
                offersReceived={offersReceived}
                handleClickOpen={handleClickOpen}
                handleClickOpenRej={handleClickOpenRej}
                collection={collection}
                canisterId={canisterId}
              />,
              <BidsSentTab bidsSent={bidsSent} collection={collection} canisterId={canisterId} />,
              <BidsReceivedTab
                bidsReceived={bidsReceived}
                collection={collection}
                canisterId={canisterId}
              />,
            ]}
          />
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

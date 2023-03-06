import React, { useContext, useEffect, useState } from 'react';
import { useDebug } from '@dapp/features-debug-provider';
import { AuthContext, useRoute } from '@dapp/features-authentication';
import { Container, Modal, HR, TabContent } from '@origyn-sa/origyn-art-ui';
import { ConfirmSalesActionModal } from './ConfirmSalesActionModal';
import { OffersReceivedTab } from './offersReceivedTab';
import { BidsReceivedTab } from './bidsReceivedTab';
import { OffersSentTab } from './offersSentTab';
import { BidsSentTab } from './bidsSentTab';
import { BalanceResponse, OrigynError, EscrowRecord } from '@dapp/common-types';

const ManageEscrowsModal = ({ open, handleClose, collection }: any) => {
  const debug = useDebug();
  const { principal, actor } = useContext(AuthContext);
  const [selectedEscrow, setSelectedEscrow] = useState<any>();
  const [selectedOffer, setSelectedOffer] = useState<any>();
  const [openConfirmation, setOpenConfirmation] = React.useState(false);
  const [selectdNFT, setSelectdNFT] = React.useState<any>();
  const [dialogAction, setDialogAction] = useState<any>();

  const [canisterId, setCanisterId] = React.useState('');
  const [escrow, setEscrow] = useState<EscrowRecord[]>();
  const [offersReceived, setOffersReceived] = useState<EscrowRecord[]>();
  const [bidsReceived, setBidsReceived] = useState<EscrowRecord[]>();
  const [offersSent, setOffersSent] = useState<EscrowRecord[]>();
  const [bidsSent, setBidsSent] = useState<EscrowRecord[]>();

  // TODO: uncomment when totalAm is used
  // const [totalAm, setTotalAm] = useState();

  //-----------------
  const Balance = async () => {
    try {
      const response = await actor?.balance_of_nft_origyn({ principal });
      debug.log('response from actor?.balance_of_nft_origyn({ principal })');
      debug.log(JSON.stringify(response, null, 2));
      if ('err' in response) {
        const error: OrigynError = response.err;
        debug.log('error', error);
        return;
      } else {
        const balanceResponse: BalanceResponse = response.ok;
        const offersAndBidsReceived = await balanceResponse.offers;
        const sentEscrows = await balanceResponse.escrow;
        // If there is a sale_id, it means that the Escrow is Associated to a Sale Process
        // and it is a Bid, otherwise it is an Offer
        const bidsReceived = offersAndBidsReceived?.filter((element) => element.sale_id.length > 0);
        const offersReceived = offersAndBidsReceived?.filter(
          (element) => element.sale_id.length === 0,
        );
        const bidsSent = sentEscrows?.filter((element) => element.sale_id.length > 0);
        //debug.log('bidsSent', bidsSent);
        const offersSent = sentEscrows?.filter((element) => element.sale_id.length === 0);
        //debug.log('offersSent', offersSent);
        setOffersReceived(offersReceived);
        setBidsReceived(bidsReceived);
        setEscrow(sentEscrows);
        setOffersSent(offersSent);
        setBidsSent(bidsSent);
      }
    } catch (e) {
      debug.log('error', e);
    }
  };

  useEffect(() => {
    useRoute().then(({ canisterId }) => {
      setCanisterId(canisterId);
    });
  }, []);

  const withdrawEscrow = async (escrow: EscrowRecord, token_id: string) => {
    setSelectdNFT(token_id);
    setOpenConfirmation(true);
    setSelectedEscrow(escrow);
    setDialogAction('withdraw');
  };

  const handleClickOpen = (offer: EscrowRecord, token_id: string) => {
    setOpenConfirmation(true);
    setDialogAction('acceptOffer');
    setSelectdNFT(token_id);
    setSelectedOffer(offer);
  };

  const handleClickOpenRej = (escrow: EscrowRecord) => {
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

    escrow.map((esc: EscrowRecord) => totalEsc.push(Number(esc.amount) * 0.00000001));
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
                key="offers-sent"
                offersSent={offersSent}
                collection={collection}
                canisterId={canisterId}
                withdrawEscrow={withdrawEscrow}
              />,
              <OffersReceivedTab
                key="offers-received"
                offersReceived={offersReceived}
                handleClickOpen={handleClickOpen}
                handleClickOpenRej={handleClickOpenRej}
                collection={collection}
                canisterId={canisterId}
              />,
              <BidsSentTab
                key="bids-sent"
                bidsSent={bidsSent}
                collection={collection}
                canisterId={canisterId}
              />,
              <BidsReceivedTab
                key="bids-received"
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

import React from 'react';
import { Container, Modal, HR, TabContent } from '@origyn/origyn-art-ui';
import { OffersReceivedTab } from './offersReceivedTab';
import { BidsReceivedTab } from './bidsReceivedTab';
import { OffersSentTab } from './offersSentTab';
import { BidsSentTab } from './bidsSentTab';

const ManageEscrowsModal = ({ open, handleClose, collection }: any) => {

  return (
    <>
      <Modal isOpened={open} closeModal={() => handleClose(false)} size="md">
        <Container size="full" padding="48px">
          <h3>Manage Escrows</h3>
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
                collection={collection}
              />,
              <OffersReceivedTab
                key="offers-received"
                collection={collection}
              />,
              <BidsSentTab
                key="bids-sent"
                collection={collection}
              />,
              <BidsReceivedTab
                key="bids-received"
                collection={collection}
              />,
            ]}
          />
        </Container>
      </Modal>
    </>
  );
};

export default ManageEscrowsModal;

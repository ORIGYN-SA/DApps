import React, { useEffect } from 'react';
import { useRoute } from '@dapp/features-authentication';
import { Container, Modal, HR, TabContent } from '@origyn/origyn-art-ui';
import { OffersReceivedTab } from './offersReceivedTab';
import { BidsReceivedTab } from './bidsReceivedTab';
import { OffersSentTab } from './offersSentTab';
import { BidsSentTab } from './bidsSentTab';

const ManageEscrowsModal = ({ open, handleClose, collection }: any) => {
  const [canisterId, setCanisterId] = React.useState('');

  useEffect(() => {
    useRoute().then(({ canisterId }) => {
      setCanisterId(canisterId);
    });
  }, []);

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
              <OffersSentTab key="offers-sent" collection={collection} canisterId={canisterId} />,
              <OffersReceivedTab
                key="offers-received"
                collection={collection}
                canisterId={canisterId}
              />,
              <BidsSentTab key="bids-sent" collection={collection} canisterId={canisterId} />,
              <BidsReceivedTab
                key="bids-received"
                collection={collection}
                canisterId={canisterId}
              />,
            ]}
          />
        </Container>
      </Modal>
    </>
  );
};

export default ManageEscrowsModal;

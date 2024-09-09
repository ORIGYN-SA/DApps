import React, { useState, useEffect, useContext } from 'react';
import { TokenIcon } from '@dapp/features-components';
import { AuthContext } from '@dapp/features-authentication';
import { Button, HR, theme, Modal, Flex, Container } from '@origyn/origyn-art-ui';
import {
  OdcDataWithSale,
  parseOdcs,
  toLargerUnit,
  parseTokenSymbol,
  ReceivedOffersProps,
} from '@dapp/utils';
import { PlaceholderIcon } from '@dapp/common-assets';
import { EscrowRecord } from '@origyn/mintjs';
import { LoadingContainer } from '@dapp/features-components';
import { useDebug } from '@dapp/features-debug-provider';
import { useUserMessages } from '@dapp/features-user-messages';
import { useApi } from '@dapp/common-api';
import { PerpetualOSContext } from '@dapp/features-context-provider';

const styles = {
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: '42px 2fr repeat(3, 1fr)',
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

interface OffersTabProps {
  collection: any;
}

type ActionType = 'accept' | 'reject';

export const OffersReceivedTab = ({ collection }: OffersTabProps) => {
  const debug = useDebug();
  const { getNftBatch, getNftBalances, acceptEscrow, rejectEscrow } = useApi();
  const { principal } = useContext(AuthContext);
  const { showUnexpectedErrorMessage, showSuccessMessage } = useUserMessages();
  const [offersReceived, setOffersReceived] = useState<EscrowRecord[]>([]);
  const [parsedOffersReceived, setParsedOffersReceived] = useState<ReceivedOffersProps[]>([]);
  const [selectedOffer, setSelectedOffer] = React.useState<EscrowRecord>();
  const [actionType, setActionType] = React.useState<ActionType>();
  const [openModal, setOpenModal] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const context = useContext(PerpetualOSContext);

  const onOfferSelected = (offer: EscrowRecord, action: ActionType) => {
    setActionType(action);
    setSelectedOffer(offer);
    setOpenModal(true);
  };

  const onModalClose = () => {
    setOpenModal(false);
  };

  const getOffersReceivedBalance = async () => {
    try {
      if (principal) {
        setIsLoading(true);
        const balances = await getNftBalances(principal);
        const offersAndBidsReceived = balances.offers;
        const offersReceived = offersAndBidsReceived?.filter((o) => o.sale_id.length === 0);
        setOffersReceived(offersReceived);
      }
    } catch (e) {
      showUnexpectedErrorMessage(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOffers = async () => {
    try {
      setIsLoading(true);
      const tokenIds = offersReceived.map((offer) => offer.token_id);
      const odcs = await getNftBatch(tokenIds);
      //@ts-ignore
      const parsedOdcs = parseOdcs(odcs);
      const parsedOffersReceived = parsedOdcs.map((odc: OdcDataWithSale, index) => {
        const offer = offersReceived[index];
        return {
          ...odc,
          token_id: offer.token_id,
          amount: toLargerUnit(Number(offer.amount), Number(offer.token['ic'].decimals)).toString(),
          escrow_record: offer,
          isNftOwner: odc.ownerPrincipalId == principal?.toText(),
        };
      });
      setParsedOffersReceived(parsedOffersReceived);
      debug.log('parsedOffersReceived', parsedOffersReceived);
    } catch (e) {
      showUnexpectedErrorMessage(e);
    } finally {
      setIsLoading(false);
    }
  };

  const onConfirmOfferAcceptOrReject = async (offer: EscrowRecord, action: ActionType) => {
    try {
      setIsLoading(true);
      if (!offer) {
        return onModalClose();
      }
      if (action == 'reject') {
        await rejectEscrow(offer);
        showSuccessMessage('Offer rejected.');
      } else if (action == 'accept') {
        await acceptEscrow(offer);
        showSuccessMessage('Offer accepted.');
      }
    } catch (e) {
      showUnexpectedErrorMessage(e);
    } finally {
      setIsLoading(false);
      getOffersReceivedBalance();
      onModalClose();
    }
  };

  useEffect(() => {
    getOffersReceivedBalance();
  }, []);

  useEffect(() => {
    if (offersReceived?.length > 0) {
      fetchOffers();
    }
  }, [offersReceived]);

  return (
    <>
      {isLoading ? (
        <>
          <HR marginTop={24} />
          <LoadingContainer margin="24px" />
        </>
      ) : (
        <>
          {offersReceived?.length > 0 ? (
            <div>
              <HR marginTop={16} marginBottom={16} />
              <div style={styles.gridContainer}>
                {parsedOffersReceived.map((offer: ReceivedOffersProps, index: number) => (
                  <React.Fragment key={`${index}Row`}>
                    <div style={styles.gridItem}>
                      {offer.hasPreviewAsset ? (
                        <img
                          style={{
                            width: 'auto',
                            height: '42px',
                            borderRadius: '12px',
                          }}
                          src={`${context.canisterUrl}/-/${offer.token_id}/preview`}
                          alt=""
                        />
                      ) : (
                        <PlaceholderIcon width={42} height={42} />
                      )}
                    </div>
                    <div style={styles.gridItem}>
                      <span>{offer.token_id}</span>
                      <br />
                      <span style={{ color: theme.colors.SECONDARY_TEXT }}>{collection.name}</span>
                    </div>
                    <div style={styles.gridItem}>
                      <p style={{ color: theme.colors.SECONDARY_TEXT }}>Offer</p>
                      <TokenIcon symbol={parseTokenSymbol(offer.escrow_record)} />
                      {offer.amount}
                    </div>
                    <div style={styles.gridItem}>
                      {offer.isNftOwner ? (
                        <Button
                          btnType="filled"
                          size="small"
                          onClick={() => onOfferSelected(offer.escrow_record, 'accept')}
                        >
                          Accept
                        </Button>
                      ) : (
                        <Button btnType="filled" size="small" disabled={true}>
                          Accept
                        </Button>
                      )}
                    </div>
                    <div style={styles.gridItem}>
                      <Button
                        btnType="outlined"
                        size="small"
                        onClick={() => onOfferSelected(offer.escrow_record, 'reject')}
                      >
                        Reject
                      </Button>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          ) : (
            <>
              <HR marginTop={16} marginBottom={16} />
              <p>
                <b>No offers received yet</b>
              </p>
            </>
          )}
        </>
      )}

      <Modal isOpened={openModal} closeModal={() => onModalClose} size="md">
        <Container size="full" padding="48px">
          <h2>Confirm offer {actionType === 'accept' ? 'accept' : 'reject'}</h2>
          <br />
          <Flex flexFlow="column">
            {
              <p>
                Are you sure you want to {actionType == 'accept' ? 'accept' : 'reject'} the offer
                for <b>Token:</b> {selectedOffer?.token_id}
              </p>
            }
          </Flex>
          <HR marginTop={24} marginBottom={24} />
          <Flex flexFlow="row" justify="flex-end" gap={16}>
            <Flex>
              <Button onClick={() => onModalClose()} disabled={isLoading}>
                Cancel
              </Button>
            </Flex>
            <Flex>
              <Button
                onClick={() =>
                  selectedOffer &&
                  actionType &&
                  onConfirmOfferAcceptOrReject(selectedOffer, actionType)
                }
                disabled={isLoading}
              >
                Confirm
              </Button>
            </Flex>
          </Flex>
          {isLoading && (
            <>
              <HR marginTop={24} />
              <LoadingContainer margin="24px" />
            </>
          )}
        </Container>
      </Modal>
    </>
  );
};

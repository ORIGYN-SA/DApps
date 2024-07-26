import React, { useState, useEffect, useContext } from 'react';
import { TokenIcon } from '@dapp/features-components';
import { AuthContext } from '@dapp/features-authentication';
import { Button, HR, theme, Modal, Container, Flex } from '@origyn/origyn-art-ui';
import {
  OdcDataWithSale,
  parseOdcs,
  toLargerUnit,
  parseTokenSymbol,
  SentOffersProps,
} from '@dapp/utils';
import { useTokensContext } from '@dapp/features-tokens-provider';
import { PlaceholderIcon } from '@dapp/common-assets';
import { BalanceResponse, EscrowRecord } from '@origyn/mintjs';
import { LoadingContainer } from '@dapp/features-components';
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

interface OffersSentTabProps {
  collection: any;
}

export const OffersSentTab = ({ collection }: OffersSentTabProps) => {
  const { getNftBatch, getNftBalances, withdrawEscrow } = useApi();
  const { showSuccessMessage, showErrorMessage, showUnexpectedErrorMessage } = useUserMessages();
  const { refreshAllBalances } = useTokensContext();
  const { principal } = useContext(AuthContext);
  const [offerSentWithSaleData, setOffersSentWithSaleData] = useState<SentOffersProps[]>([]);
  const [offersSent, setOffersSent] = useState<EscrowRecord[]>([]);
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedOffer, setSelectedOffer] = React.useState<EscrowRecord>();
  const [isLoading, setIsLoading] = React.useState(false);
  const context = useContext(PerpetualOSContext);

  const onModalClose = () => {
    setOpenModal(false);
  };

  const onOfferSelected = (offer: EscrowRecord) => {
    setSelectedOffer(offer);
    setOpenModal(true);
  };

  const fetchOffers = async () => {
    try {
      setIsLoading(true);

      const tokenIds = offersSent.map((offer) => offer.token_id);
      const odcs = await getNftBatch(tokenIds);
      const parsedOdcs = parseOdcs(odcs);
      const offersSentWithSaleData = parsedOdcs.map((odc: OdcDataWithSale, index) => {
        const offer = offersSent[index];
        return {
          ...odc,
          token_id: offer.token_id,
          amount: toLargerUnit(Number(offer.amount), Number(offer.token['ic'].decimals)).toFixed(),
          lock_to_date: offer.lock_to_date,
          escrow_record: offer,
        };
      });
      setOffersSentWithSaleData(offersSentWithSaleData);
    } catch (e) {
      showUnexpectedErrorMessage(e);
    } finally {
      setIsLoading(false);
    }
  };

  const onConfirmOfferWithdraw = async (escrow: EscrowRecord) => {
    try {
      setIsLoading(true);
      if (!escrow) {
        return onModalClose();
      }
      await withdrawEscrow(escrow);
      showSuccessMessage('Offer withdrawn successfully.');
    } catch (e) {
      showUnexpectedErrorMessage(e);
    } finally {
      if (refreshAllBalances && principal) {
        refreshAllBalances(principal);
        setIsLoading(false);
        getOffersSentBalance();
        onModalClose();
      }
    }
  };

  const getOffersSentBalance = async () => {
    // TODO: Implement this pattern in all other components and functions
    // fetch, catch, parse, update state, catch
    try {
      if (principal) {
        setIsLoading(true);

        let balances: BalanceResponse;
        try {
          balances = await getNftBalances(principal);
        } catch (e: any) {
          showErrorMessage(e.message);
          return;
        }

        const offersSent = balances.escrow?.filter((element) => element.sale_id.length === 0);
        setOffersSent(offersSent);
      }
    } catch (e) {
      showUnexpectedErrorMessage(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getOffersSentBalance();
  }, []);

  useEffect(() => {
    if (offersSent?.length) {
      fetchOffers();
    }
  }, [offersSent]);

  return (
    <>
      {isLoading ? (
        <>
          <HR marginTop={24} />
          <LoadingContainer margin="24px" />
        </>
      ) : (
        <>
          {offersSent?.length > 0 ? (
            <div>
              <HR marginTop={16} marginBottom={16} />
              <div style={styles.gridContainer}>
                {offerSentWithSaleData.map((offer: SentOffersProps, index: number) => (
                  <React.Fragment key={`${index}Row`}>
                    <div style={styles.gridItem}>
                      {offer.hasPreviewAsset ? (
                        <img
                          style={{
                            height: '42px',
                            width: 'auto',
                            borderRadius: '12px',
                          }}
                          src={`${context.canisterUrl}/-/${offer.token_id}/preview`}
                          alt=""
                        />
                      ) : (
                        <PlaceholderIcon
                          width={42}
                          height={42}
                          style={{ marginTop: 'auto', marginBottom: 'auto' }}
                        />
                      )}
                    </div>
                    <div style={styles.gridItem}>
                      <p>{offer.token_id}</p>
                      <span style={{ color: theme.colors.SECONDARY_TEXT }}>{collection.name}</span>
                    </div>
                    <div style={styles.gridItem}>
                      <span style={{ color: theme.colors.SECONDARY_TEXT }}>Offer</span>
                      <br />
                      <TokenIcon symbol={parseTokenSymbol(offer.escrow_record)} />
                      {offer.amount}
                    </div>
                    <div style={styles.gridItem}>
                      <span style={{ color: theme.colors.SECONDARY_TEXT }}>Status</span>
                      <br />
                      <span>
                        {offer.lock_to_date
                          ? Date.now() * 1e6 > parseInt(offer.lock_to_date)
                            ? 'Locked'
                            : 'Done'
                          : 'Lock date not present'}
                      </span>
                    </div>
                    <div style={styles.gridItem}>
                      {Date.now() * 1e6 > parseInt(offer.lock_to_date) ? (
                        <Button btnType="filled" size="small" disabled>
                          Withdraw
                        </Button>
                      ) : (
                        <Button
                          btnType="filled"
                          size="small"
                          onClick={() => onOfferSelected(offer.escrow_record)}
                        >
                          Withdraw
                        </Button>
                      )}
                    </div>
                  </React.Fragment>
                ))}{' '}
              </div>
            </div>
          ) : (
            <>
              <HR marginTop={16} marginBottom={16} />
              <p>
                <b>No offers sent yet</b>
              </p>
            </>
          )}
        </>
      )}

      <Modal isOpened={openModal} closeModal={() => onModalClose} size="md">
        <Container size="full" padding="48px">
          <h2>Confirm Offer Withdraw</h2>
          <br />
          <Flex flexFlow="column">Are you sure you want to withdraw the offer?</Flex>
          <HR marginTop={24} marginBottom={24} />
          <Flex flexFlow="row" justify="flex-end" gap={16}>
            <Flex>
              <Button onClick={() => onModalClose()} disabled={isLoading}>
                Cancel
              </Button>
            </Flex>
            <Flex>
              <Button
                onClick={() => selectedOffer && onConfirmOfferWithdraw(selectedOffer)}
                variant="contained"
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

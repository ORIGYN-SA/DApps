import React, { useState, useEffect, useContext } from 'react';
import { TokenIcon } from '@dapp/features-components';
import { AuthContext } from '@dapp/features-authentication';
import { Button, HR, theme, Modal, Container, Flex } from '@origyn-sa/origyn-art-ui';
import { OdcDataWithSale, parseOdcs, toLargerUnit } from '@dapp/utils';
import { PlaceholderIcon } from '@dapp/common-assets';
import { useDebug } from '@dapp/features-debug-provider';
import { EscrowRecord, OrigynError, BalanceResponse } from '@dapp/common-types';
import { useSnackbar } from 'notistack';
import { LoadingContainer } from '@dapp/features-components';
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
  canisterId: string;
}

interface SentOffersProps extends OdcDataWithSale {
  token_id: string;
  amount: string;
  symbol: string;
  lock_to_date: any;
  escrow_record: EscrowRecord;
}

export const OffersSentTab = ({ collection, canisterId }: OffersSentTabProps) => {
  const debug = useDebug();
  const { actor, principal } = useContext(AuthContext);
  const [offerSentWithSaleData, setOffersSentWithSaleData] = useState<SentOffersProps[]>([]);
  const [offersSent, setOffersSent] = useState<EscrowRecord[]>([]);
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedOffer, setSelectedOffer] = React.useState<EscrowRecord>();
  const [isLoading, setIsLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar() || {};

  const onModalClose = () => {
    setOpenModal(false);
  };

  const onOfferSelected = (offer: EscrowRecord) => {
    setSelectedOffer(offer);
    setOpenModal(true);
  };

  const parseOffers = async () => {
    debug.log('offersSent', offersSent);
    const tokenIds = offersSent.map((offer) => offer.token_id);
    const odcDataRaw = await actor?.nft_batch_origyn(tokenIds);
    debug.log('odcDataRaw', odcDataRaw);
    if (odcDataRaw.err) {
      debug.error(odcDataRaw.err);
      throw new Error('Unable to retrieve metadata of tokens.');
    }

    const parsedOdcs = parseOdcs(odcDataRaw);
    parsedOdcs.map((odc: OdcDataWithSale, index) => {
      const offer = offersSent[index];
      let sentOffer: SentOffersProps = {
        ...odc,
        token_id: offer.token_id,
        amount: toLargerUnit(Number(offer.amount), Number(offer.token['ic'].decimals)).toString(),
        symbol: offer.token['ic'].symbol,
        lock_to_date: offer.lock_to_date,
        escrow_record: offer,
      };
      setOffersSentWithSaleData((prev) => [...prev, sentOffer]);
    });
  };

  const confirmOfferWithdraw = async (escrow: EscrowRecord) => {
    try {
      setIsLoading(true);
      if (!escrow) {
        return onModalClose();
      }
      const withdrawResponse = await actor?.sale_nft_origyn({
        withdraw: {
          escrow: {
            ...escrow,
            withdraw_to: { principal },
          },
        },
      });

      if ('err' in withdrawResponse) {
        enqueueSnackbar(`Error: ${withdrawResponse.err.flag_point}.`, {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
      } else {
        enqueueSnackbar('Your escrow has been successfully withdrawn.', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
      }
    } catch (e) {
      debug.log(e);
    } finally {
      setIsLoading(false);
      getOffersSentBalance();
      onModalClose();
    }
  };

  const getOffersSentBalance = async () => {
    try {
      const response = await actor.balance_of_nft_origyn({ principal });
      debug.log('response from actor?.balance_of_nft_origyn({ principal })');
      debug.log(JSON.stringify(response, null, 2));
      if ('err' in response) {
        const error: OrigynError = response.err;
        debug.log('error', error);
        return;
      } else {
        const balanceResponse: BalanceResponse = response.ok;
        const sentEscrows = await balanceResponse.escrow;
        const offersSent = sentEscrows?.filter((element) => element.sale_id.length === 0);
        setOffersSent(offersSent);
      }
    } catch (e) {
      debug.log('error', e);
    }
  };

  useEffect(() => {
    getOffersSentBalance();
  }, []);

  useEffect(() => {
    if (offersSent?.length) {
      parseOffers();
    }
  }, [offersSent]);

  return (
    <>
      {offersSent?.length > 0 ? (
        <div>
          <HR marginTop={16} marginBottom={16} />
          <div style={styles.gridContainer}>
            {offerSentWithSaleData.map((offer: SentOffersProps, index: number) => (
              <>
                <div key={index} style={styles.gridItem}>
                  {offer.hasPreviewAsset ? (
                    <img
                      style={{ height: '42px', width: 'auto', borderRadius: '12px' }}
                      src={`https://${canisterId}.raw.ic0.app/-/${offer.token_id}/preview`}
                      alt=""
                    />
                  ) : (
                    <PlaceholderIcon
                      width={42}
                      height={42}
                      marginTop={'auto'}
                      marginBottom={'auto'}
                    />
                  )}
                </div>
                <div style={styles.gridItem}>
                  <div>
                    <p>{offer.token_id}</p>
                  </div>

                  <span style={{ color: theme.colors.SECONDARY_TEXT }}>{collection.name}</span>
                </div>
                <div style={styles.gridItem}>
                  <span style={{ color: theme.colors.SECONDARY_TEXT }}>Amount</span>
                  <br />
                  <div>
                    <TokenIcon symbol={offer.token.symbol} />
                    {offer.amount}
                  </div>
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
              </>
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
      <Modal isOpened={openModal} closeModal={() => onModalClose} size="md">
        <Container size="full" padding="48px">
          <h2>Confirm Offer Withdraw</h2>
          <br />
          <Flex flexFlow="column">Are you sure you want to withdraw the offer?</Flex>
          <HR marginTop={24} marginBottom={24} />
          <Flex flow="row" justify="flex-end" gap={16}>
            <Flex>
              <Button onClick={() => onModalClose()} disabled={isLoading}>
                Cancel
              </Button>
            </Flex>
            <Flex>
              <Button
                onClick={() => confirmOfferWithdraw(selectedOffer)}
                variant="contained"
                disabled={isLoading}
              >
                Confirm
              </Button>
            </Flex>
          </Flex>
          {isLoading && (
            <>
              <HR marginTop={24} marginBottom={24} />
              <LoadingContainer />
            </>
          )}
        </Container>
      </Modal>
    </>
  );
};

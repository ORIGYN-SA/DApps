import React, { useState, useEffect, useContext } from 'react';
import { TokenIcon } from '@dapp/features-components';
import { AuthContext } from '@dapp/features-authentication';
import { useTokensContext } from '@dapp/features-tokens-provider';
import { Button, HR, theme, Modal, Flex, Container } from '@origyn-sa/origyn-art-ui';
import { OdcDataWithSale, parseOdcs, toLargerUnit } from '@dapp/utils';
import { PlaceholderIcon } from '@dapp/common-assets';
import { EscrowRecord, EscrowReceipt, OrigynError, BalanceResponse } from '@dapp/common-types';
import { LoadingContainer } from '@dapp/features-components';
import { useSnackbar } from 'notistack';
import { useDebug } from '@dapp/features-debug-provider';
import { Principal } from '@dfinity/principal';

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
  canisterId: string;
}

interface ReceivedOffersProps extends OdcDataWithSale {
  token_id: string;
  amount: string;
  symbol: string;
  escrow_record: EscrowRecord;
}

type ActionType = 'accept' | 'reject';

export const OffersReceivedTab = ({ collection, canisterId }: OffersTabProps) => {
  const debug = useDebug();
  const { actor, principal } = useContext(AuthContext);
  const { tokens } = useTokensContext();
  const [offersReceived, setOffersReceived] = useState<EscrowRecord[]>([]);
  const [parsedOffersReceived, setParsedOffersReceived] = useState<ReceivedOffersProps[]>([]);
  const [selectedOffer, setSelectedOffer] = React.useState<EscrowRecord>();
  const [actionType, setActionType] = React.useState<ActionType>();
  const [openModal, setOpenModal] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar() || {};

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
      const response = await actor.balance_of_nft_origyn({ principal });
      debug.log('response from actor?.balance_of_nft_origyn({ principal })');
      debug.log(JSON.stringify(response, null, 2));
      if ('err' in response) {
        const error: OrigynError = response.err;
        debug.log('error', error);
        return;
      } else {
        const balanceResponse: BalanceResponse = response.ok;
        const offersAndBidsReceived = await balanceResponse.offers;
        const offersReceived = offersAndBidsReceived?.filter(
          (element) => element.sale_id.length === 0,
        );
        setOffersReceived(offersReceived);
      }
    } catch (e) {
      debug.log('error', e);
    }
  };

  const parseOffers = async () => {
    const tokenIds = offersReceived.map((offer) => offer.token_id);
    const odcDataRaw = await actor?.nft_batch_origyn(tokenIds);

    if (odcDataRaw.err) {
      throw new Error('Unable to retrieve metadata of tokens.');
    }

    const parsedOdcs = parseOdcs(odcDataRaw);
    parsedOdcs.map((odc: OdcDataWithSale, index) => {
      const offer = offersReceived[index];
      let sentOffer: ReceivedOffersProps = {
        ...odc,
        token_id: offer.token_id,
        amount: toLargerUnit(Number(offer.amount), Number(offer.token['ic'].decimals)).toString(),
        symbol: offer.token['ic'].symbol,
        escrow_record: offer,
      };
      setParsedOffersReceived((prev) => [...prev, sentOffer]);
    });
  };

  const onConfirmOfferAcceptOrReject = async (offer: EscrowRecord, action: ActionType) => {
    try {
      setIsLoading(true);
      if (!offer) {
        return onModalClose();
      }
      if (action == 'reject') {
        const rejectResponse = await actor?.sale_nft_origyn({
          withdraw: {
            reject: {
              ...offer,
            },
          },
        });

        if ('err' in rejectResponse) {
          enqueueSnackbar(`Error: ${rejectResponse.err.text}.`, {
            variant: 'error',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
          });
        } else {
          enqueueSnackbar('The escrow has been rejected.', {
            variant: 'success',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
          });
        }
      }
      if (action == 'accept') {
        const escrowReceipt: EscrowReceipt = {
          seller: { principal: offer.seller['principal'] },
          buyer: { principal: offer.buyer['principal'] },
          token_id: offer.token_id,
          token: {
            ic: {
              fee: BigInt(tokens[offer.token['ic'].symbol]?.fee ?? 200000),
              decimals: BigInt(tokens[offer.token['ic'].symbol]?.decimals ?? 8),
              canister: Principal.fromText(tokens[offer.token['ic'].symbol]?.canisterId),
              standard: { Ledger: null },
              symbol: offer.token['ic'].symbol,
            },
          },
          amount: BigInt(offer.amount),
        };

        const saleReceipt = {
          broker_id: [],
          pricing: { instant: null },
          escrow_receipt: [escrowReceipt],
        };
        const acceptOffer = await actor.market_transfer_nft_origyn({
          token_id: offer.token_id,
          sales_config: saleReceipt,
        });
        debug.log(acceptOffer.err);
        if ('err' in acceptOffer) {
          enqueueSnackbar('There has been an error in accepting the offer', {
            variant: 'error',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
          });
        } else {
          enqueueSnackbar('The offer has been accepted.', {
            variant: 'success',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
          });
        }
      }
    } catch (e) {
      debug.log(e);
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
      parseOffers();
    }
  }, [offersReceived]);

  return (
    <>
      {offersReceived?.length > 0 ? (
        <div>
          <HR marginTop={16} marginBottom={16} />
          <div style={styles.gridContainer}>
            {parsedOffersReceived.map((offer: ReceivedOffersProps) => (
              <>
                <div style={styles.gridItem}>
                  {offer.hasPreviewAsset ? (
                    <img
                      style={{ width: 'auto', height: '42px', borderRadius: '12px' }}
                      src={`https://${canisterId}.raw.ic0.app/-/${offer.token_id}/preview`}
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
                  <p style={{ color: theme.colors.SECONDARY_TEXT }}>Amount</p>
                  <TokenIcon symbol={offer.tokenSymbol} />
                  {offer.amount}
                </div>
                <div style={styles.gridItem}>
                  <Button
                    btnType="filled"
                    size="small"
                    onClick={() => onOfferSelected(offer.escrow_record, 'accept')}
                  >
                    Accept
                  </Button>
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
              </>
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
          <Flex flow="row" justify="flex-end" gap={16}>
            <Flex>
              <Button onClick={() => onModalClose()} disabled={isLoading}>
                Cancel
              </Button>
            </Flex>
            <Flex>
              <Button
                onClick={() => onConfirmOfferAcceptOrReject(selectedOffer, actionType)}
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

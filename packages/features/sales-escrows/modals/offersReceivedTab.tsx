import React, { useState, useEffect, useContext } from 'react';
import { TokenIcon } from '@dapp/features-components';
import { AuthContext } from '@dapp/features-authentication';
import { Button, HR, theme } from '@origyn-sa/origyn-art-ui';
import { OdcDataWithSale, parseOdcs, toLargerUnit } from '@dapp/utils';
import { PlaceholderIcon } from '@dapp/common-assets';
import { EscrowRecord } from '@dapp/common-types';

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
  offersReceived: EscrowRecord[];
  collection: any;
  canisterId: string;
  handleClickOpen: (esc: any, token_id: any) => void;
  handleClickOpenRej: (esc: any) => void;
}

interface ReceivedOffersProps extends OdcDataWithSale {
  token_id: string;
  amount: string;
  symbol: string;
}

export const OffersReceivedTab = ({
  offersReceived: offers,
  collection,
  canisterId,
  handleClickOpen,
  handleClickOpenRej,
}: OffersTabProps) => {
  const { actor } = useContext(AuthContext);
  const [receivedOffers, setReceivedOffers] = useState<ReceivedOffersProps[]>([]);

  const parseOffers = async () => {
    const tokenIds = offers.map((offer) => offer.token_id);
    const odcDataRaw = await actor?.nft_batch_origyn(tokenIds);

    if (odcDataRaw.err) {
      throw new Error('Unable to retrieve metadata of tokens.');
    }

    const parsedOdcs = parseOdcs(odcDataRaw);
    parsedOdcs.map((odc: OdcDataWithSale, index) => {
      const offer = offers[index];
      let sentOffer: ReceivedOffersProps = {
        ...odc,
        token_id: offer.token_id,
        amount: toLargerUnit(Number(offer.amount), Number(offer.token['ic'].decimals)).toString(),
        symbol: offer.token['ic'].symbol,
      };
      setReceivedOffers((prev) => [...prev, sentOffer]);
    });
  };

  useEffect(() => {
    parseOffers();
  }, []);

  return (
    <>
      {offers.length > 0 ? (
        <div>
          <HR marginTop={16} marginBottom={16} />
          <div style={styles.gridContainer}>
            {receivedOffers.map((offer: ReceivedOffersProps) => (
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
                    onClick={() => handleClickOpen(offer, offer.token_id)}
                  >
                    Accept
                  </Button>
                </div>
                <div style={styles.gridItem}>
                  <Button btnType="outlined" size="small" onClick={() => handleClickOpenRej(offer)}>
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
    </>
  );
};

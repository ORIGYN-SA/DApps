import React, { useState, useEffect, useContext } from 'react';
import { TokenIcon } from '@dapp/features-components';
import { AuthContext } from '@dapp/features-authentication';
import { Button, HR, theme } from '@origyn-sa/origyn-art-ui';
import { OdcDataWithSale, parseOdcs, toLargerUnit } from '@dapp/utils';
import { PlaceholderIcon } from '@dapp/common-assets';
import { useDebug } from '@dapp/features-debug-provider';
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

interface OffersSentTabProps {
  offersSent: EscrowRecord[];
  collection: any;
  canisterId: string;
  withdrawEscrow: (esc: any, token_id: any) => void;
}

interface SentOffersProps extends OdcDataWithSale {
  token_id: string;
  amount: string;
  symbol: string;
  lock_to_date: any;
}

export const OffersSentTab = ({
  offersSent,
  collection,
  canisterId,
  withdrawEscrow,
}: OffersSentTabProps) => {
  const debug = useDebug();
  const { actor } = useContext(AuthContext);
  const [sentOffers, setSentOffers] = useState<SentOffersProps[]>([]);

  const parseOffers = async () => {
    const tokenIds = offersSent.map((offer) => offer.token_id);
    const odcDataRaw = await actor?.nft_batch_origyn(tokenIds);

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
      };
      setSentOffers((prev) => [...prev, sentOffer]);
    });
  };

  useEffect(() => {
    parseOffers();
  }, []);

  return (
    <>
      {offersSent?.length > 0 ? (
        <div>
          <HR marginTop={16} marginBottom={16} />
          <div style={styles.gridContainer}>
            {sentOffers.map((offer: SentOffersProps, index: number) => (
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
                    <Button
                      btnType="filled"
                      size="small"
                      onClick={() => withdrawEscrow(offer, offer.token_id)}
                      disabled
                    >
                      Withdraw
                    </Button>
                  ) : (
                    <Button
                      btnType="filled"
                      size="small"
                      onClick={() => withdrawEscrow(offer, offer.token_id)}
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
    </>
  );
};

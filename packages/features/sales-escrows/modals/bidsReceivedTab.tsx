import React, { useState, useEffect, useContext } from 'react';
import { HR, theme } from '@origyn-sa/origyn-art-ui';
import { TokenIcon } from '@dapp/features-components';
import { AuthContext } from '@dapp/features-authentication';
import { OdcDataWithSale, parseOdcs, toLargerUnit } from '@dapp/utils';
import { formatDistanceToNow } from 'date-fns';
import { PlaceholderIcon } from '@dapp/common-assets';
import { EscrowRecord } from '@dapp/common-types';

const styles = {
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: '42px 2fr repeat(2, 1fr)',
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
  bidsReceived: EscrowRecord[];
  collection: any;
  canisterId: string;
}

interface ReceivedActiveBidsProps extends OdcDataWithSale {
  token_id: string;
}

export const BidsReceivedTab = ({
  bidsReceived: bidsReceived,
  collection,
  canisterId,
}: OffersTabProps) => {
  const { actor } = useContext(AuthContext);
  const [receivedActivedBids, setReceivedActiveBids] = useState<ReceivedActiveBidsProps[]>([]);
  const currentTimeInNanos = BigInt(new Date().getTime() * 1e6);

  const parseBids = async () => {
    const tokenIds = bidsReceived.map((offer) => offer.token_id);
    const odcDataRaw = await actor?.nft_batch_origyn(tokenIds);

    if (odcDataRaw.err) {
      throw new Error('Unable to retrieve metadata of tokens.');
    }

    const parsedOdcs = parseOdcs(odcDataRaw);
    parsedOdcs.map((odc: OdcDataWithSale, index) => {
      const bid = bidsReceived[index];
      let sentBid: ReceivedActiveBidsProps = {
        ...odc,
        token_id: bid.token_id,
      };
      if (sentBid.auction?.end_date > currentTimeInNanos) {
        // Add only the Active Bids
        setReceivedActiveBids((prev) => [...prev, sentBid]);
      }
    });
  };

  useEffect(() => {
    parseBids();
  }, []);

  return (
    <>
      {bidsReceived.length > 0 ? (
        <div>
          <HR marginTop={16} marginBottom={16} />
          <div style={styles.gridContainer}>
            {receivedActivedBids.map((bid: ReceivedActiveBidsProps) => (
              <>
                <div style={styles.gridItem}>
                  {bid.hasPreviewAsset ? (
                    <img
                      style={{ width: '42px', height: '42px', borderRadius: '12px' }}
                      src={`https://${canisterId}.raw.ic0.app/-/${bid.token_id}/preview`}
                      alt=""
                    />
                  ) : (
                    <PlaceholderIcon width={42} height={42} />
                  )}
                </div>
                <div style={styles.gridItem}>
                  <span>{bid.token_id}</span>
                  <br />
                  <span style={{ color: theme.colors.SECONDARY_TEXT }}>{collection.name}</span>
                </div>
                <div style={styles.gridItem}>
                  <p style={{ color: theme.colors.SECONDARY_TEXT }}>Current Bid</p>
                  <TokenIcon symbol={bid.tokenSymbol} />
                  {toLargerUnit(bid.currentBid, Number(bid.token.decimals))}
                </div>
                <div style={styles.gridItem}>
                  <>
                    {!bid?.auction?.end_date || bid?.auction?.end_date < currentTimeInNanos ? (
                      <span style={{ color: theme.colors.SECONDARY_TEXT }}>The sale has ended</span>
                    ) : (
                      <>
                        <p style={{ color: theme.colors.SECONDARY_TEXT }}>Ends In</p>
                        <span>
                          {formatDistanceToNow(Number(bid.auction.end_date / BigInt(1e6)))}
                        </span>
                      </>
                    )}
                  </>
                </div>
              </>
            ))}
          </div>
        </div>
      ) : (
        <>
          <HR marginTop={16} marginBottom={16} />
          <p>
            <b>No bids received yet</b>
          </p>
        </>
      )}
    </>
  );
};

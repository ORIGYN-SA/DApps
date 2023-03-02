import React, { useState, useEffect, useContext } from 'react';
import { HR, theme } from '@origyn-sa/origyn-art-ui';
import { TokenIcon } from '@dapp/features-components';
import { AuthContext } from '@dapp/features-authentication';
import { OdcDataWithSale, parseOdc, toLargerUnit } from '@dapp/utils';
import { formatDistanceToNow } from 'date-fns';
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
  bidsReceived: any[];
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
    bidsReceived.map(async (bid) => {
      const r: any = await actor.nft_origyn(bid.token_id);
      if ('err' in r) {
        throw new Error(Object.keys(r.err)[0]);
      }

      let parsedOdc: OdcDataWithSale = parseOdc(r['ok']);
      let receivedBid: ReceivedActiveBidsProps = {
        ...parsedOdc,
        token_id: bid.token_id,
      };

      if (receivedBid.auction?.end_date > currentTimeInNanos) {
        // Add only the Active Bids
        setReceivedActiveBids((prev) => [...prev, receivedBid]);
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
                  <img
                    style={{ width: '42px', height: '42px', borderRadius: '12px' }}
                    src={`https://${canisterId}.raw.ic0.app/-/${bid.token_id}/preview`}
                    alt=""
                  />
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

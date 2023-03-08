import React, { useState, useEffect, useContext } from 'react';
import { HR, theme } from '@origyn-sa/origyn-art-ui';
import { TokenIcon } from '@dapp/features-components';
import { AuthContext } from '@dapp/features-authentication';
import { OdcDataWithSale, parseOdcs, toLargerUnit } from '@dapp/utils';
import { formatDistanceToNow } from 'date-fns';
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

interface BidsSentTabProps {
  bidsSent: EscrowRecord[];
  collection: any;
  canisterId: string;
}
interface SentActiveBidsProps extends OdcDataWithSale {
  token_id: string;
  amount: string;
  symbol: string;
}

export const BidsSentTab = ({ bidsSent: bidsSent, collection, canisterId }: BidsSentTabProps) => {
  const { actor } = useContext(AuthContext);
  const debug = useDebug();
  const [sentActivedBids, setSentActiveBids] = useState<SentActiveBidsProps[]>([]);
  const currentTimeInNanos = BigInt(new Date().getTime() * 1e6);

  const parseBids = async () => {
    try {
      const tokenIds = bidsSent.map((offer) => offer.token_id);
      const odcDataRaw = await actor?.nft_batch_origyn(tokenIds);

      if (odcDataRaw.err) {
        throw new Error('Unable to retrieve metadata of tokens.');
      }

      const parsedOdcs = parseOdcs(odcDataRaw);
      parsedOdcs.map((odc: OdcDataWithSale, index) => {
        const bid = bidsSent[index];
        let sentBid: SentActiveBidsProps = {
          ...odc,
          token_id: bid.token_id,
          amount: toLargerUnit(Number(bid.amount), Number(bid.token['ic'].decimals)).toString(),
          symbol: bid.token['ic'].symbol,
        };
        if (sentBid.auction?.end_date > currentTimeInNanos) {
          // Add only the Active Bids
          setSentActiveBids((prev) => [...prev, sentBid]);
        }
      });
    } catch (e) {
      debug.log(e);
    }
  };

  useEffect(() => {
    parseBids();
  }, []);
  return (
    <>
      {bidsSent?.length > 0 ? (
        <div>
          <HR marginTop={16} marginBottom={16} />
          <div style={styles.gridContainer}>
            {sentActivedBids.map((bid: any, index: number) => (
              <>
                <div key={index} style={styles.gridItem}>
                  {bid.hasPreviewAsset ? (
                    <img
                      style={{
                        width: '42px',
                        borderRadius: '12px',
                        marginTop: 'auto',
                        marginBottom: 'auto',
                      }}
                      src={`https://${canisterId}.raw.ic0.app/-/${bid.token_id}/preview`}
                      alt=""
                    />
                  ) : (
                    <PlaceholderIcon width={42} height={42} />
                  )}
                </div>
                <div style={styles.gridItem}>
                  <div>
                    <p>{bid.token_id}</p>
                  </div>
                  <span style={{ color: theme.colors.SECONDARY_TEXT }}>{collection.name}</span>
                </div>
                <div style={styles.gridItem}>
                  <p style={{ color: theme.colors.SECONDARY_TEXT }}>Current Bid</p>
                  <TokenIcon symbol={bid.tokenSymbol} />
                  {toLargerUnit(bid.currentBid, Number(bid.token.decimals))}
                </div>
                <div style={styles.gridItem}>
                  <p style={{ color: theme.colors.SECONDARY_TEXT }}>Your bid</p>
                  <TokenIcon symbol={bid.tokenSymbol} />
                  {bid.amount}
                </div>
                <div style={styles.gridItem}>
                  <p style={{ color: theme.colors.SECONDARY_TEXT }}>Ends In</p>
                  {formatDistanceToNow(Number(bid.auction.end_date / BigInt(1e6)))}
                </div>
              </>
            ))}
          </div>
        </div>
      ) : (
        <>
          <HR marginTop={16} marginBottom={16} />
          <p>
            <b>No bids sent yet</b>
          </p>
        </>
      )}
    </>
  );
};

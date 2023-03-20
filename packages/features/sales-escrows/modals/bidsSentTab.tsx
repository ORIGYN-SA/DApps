import React, { useState, useEffect, useContext } from 'react';
import { HR, theme } from '@origyn/origyn-art-ui';
import { TokenIcon } from '@dapp/features-components';
import { AuthContext } from '@dapp/features-authentication';
import { OdcDataWithSale, parseOdcs, toLargerUnit } from '@dapp/utils';
import { formatDistanceToNow } from 'date-fns';
import { PlaceholderIcon } from '@dapp/common-assets';
import { useDebug } from '@dapp/features-debug-provider';
import { AuctionStateStable } from '@origyn/mintjs';
import { LoadingContainer } from '@dapp/features-components';
import { useUserMessages } from '@dapp/features-user-messages';
import { useApi } from '@dapp/common-api';

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
  collection: any;
  canisterId: string;
}
interface SentActiveBidsProps extends OdcDataWithSale {
  token_id: string;
  latest_bid: string;
}

export const BidsSentTab = ({ collection, canisterId }: BidsSentTabProps) => {
  const debug = useDebug();
  const { principal, actor } = useContext(AuthContext);
  const {
    getNftBatch,
    getNftSaleInfo,
    getActiveAuctions,
    getActiveAttendedAuctions,
    getActiveNftHistory,
    getActiveAttendedAuctionsTx,
    getHighestSentBids,
  } = useApi();
  const { showUnexpectedErrorMessage, showErrorMessage } = useUserMessages();
  const [sentActivedBids, setSentActiveBids] = useState<SentActiveBidsProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAuctions, setActiveAuctions] = useState<AuctionStateStable[]>([]);

  const fetchSentBids = async () => {
    try {
      setIsLoading(true);
      const activeAttendedAuctions = getActiveAttendedAuctions(principal, activeAuctions);
      if (!activeAttendedAuctions) {
        showErrorMessage('No active attended auctions');
        return;
      } else {
        debug.log('activeAttendedAuctions', activeAttendedAuctions);
        const activeNftHistory = await getActiveNftHistory(activeAttendedAuctions);
        debug.log('activeNftHistory', activeNftHistory);
        const activeAttendedAuctionsTx = getActiveAttendedAuctionsTx(activeNftHistory);
        debug.log('activeAttendedAuctionsTx', activeAttendedAuctionsTx);
        const highestBidsSent = getHighestSentBids(activeAttendedAuctionsTx);
        debug.log('highestBidsSent', highestBidsSent);

        const activeTokensIds = activeAttendedAuctions.map(
          (auction) => auction.current_escrow[0]?.token_id,
        );

        const odcDataRaw = await getNftBatch(activeTokensIds);

        const parsedOdcs = parseOdcs(odcDataRaw);
        const parsedActiveBids = parsedOdcs.map((odc: OdcDataWithSale, index) => {
          const bid = highestBidsSent[index];
          const bidAmount = 'auction_bid' in bid.txn_type && bid.txn_type.auction_bid.amount;
          const bidDecimals =
            'auction_bid' in bid.txn_type && bid.txn_type.auction_bid.token['ic'].decimals;
          return {
            ...odc,
            token_id: bid.token_id,
            latest_bid: toLargerUnit(Number(bidAmount), Number(bidDecimals)).toString(),
          };
        });
        setSentActiveBids(parsedActiveBids);
      }
    } catch (e) {
      showUnexpectedErrorMessage(e);
    } finally {
      setIsLoading(false);
    }
  };

  const getSentBidBalance = async () => {
    try {
      setIsLoading(true);
      const salesInfo = await getNftSaleInfo();
      debug.log('salesInfo', salesInfo);
      debug.log('actor', actor);
      if (salesInfo) {
        const activeAuctions = await getActiveAuctions(salesInfo);
        debug.log('activeAuctions', activeAuctions);
        setActiveAuctions(activeAuctions);
      }
    } catch (e) {
      showUnexpectedErrorMessage(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSentBidBalance();
  }, []);

  useEffect(() => {
    fetchSentBids();
  }, [activeAuctions]);

  return (
    <>
      {isLoading ? (
        <>
          <HR marginTop={24} />
          <LoadingContainer margin="24px" />
        </>
      ) : (
        <>
          {sentActivedBids?.length > 0 ? (
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
                      {toLargerUnit(bid.currentBid, Number(bid.token.decimals)).toFixed()}
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
      )}
    </>
  );
};

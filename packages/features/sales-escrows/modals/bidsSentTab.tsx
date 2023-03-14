import React, { useState, useEffect, useContext } from 'react';
import { HR, theme } from '@origyn/origyn-art-ui';
import { TokenIcon } from '@dapp/features-components';
import { AuthContext } from '@dapp/features-authentication';
import { OdcDataWithSale, parseHighestSentBids, parseOdcs, toLargerUnit } from '@dapp/utils';
import { formatDistanceToNow } from 'date-fns';
import { PlaceholderIcon } from '@dapp/common-assets';
import { useDebug } from '@dapp/features-debug-provider';
import {
  SaleInfoRequest,
  SaleInfoResponse,
  AuctionStateStable,
  TransactionRecord,
} from '@dapp/common-types';
import { LoadingContainer } from '@dapp/features-components';
import { useUserMessages } from '@dapp/features-user-messages';

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
  const { showUnexpectedErrorMessage } = useUserMessages();
  const { actor, principal } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [sentActiveBids, setSentActiveBids] = useState<SentActiveBidsProps[]>([]);
  const [activeAuctions, setActiveAuctions] = useState<AuctionStateStable[]>([]);

  const parseSentBids = async () => {
    try {
      setIsLoading(true);
      const activeAttendedAuctions: AuctionStateStable[] = activeAuctions.filter((auctionState) => {
        return auctionState.participants.some(
          (participant) => participant[0].toText() === principal.toText(),
        );
      });
      debug.log('activeAttendedAuctions', activeAttendedAuctions);

      const activeTokens = activeAttendedAuctions.map(
        (auction) => auction.current_escrow[0]?.token_id,
      );

      const historyRecords = activeTokens.map(async (token_id) => {
        const history = await actor?.history_nft_origyn(token_id, [], []);
        if ('err' in history) {
          showUnexpectedErrorMessage(history.err);
        } else {
          const response: TransactionRecord[] = await history.ok;
          return response;
        }
      });
      const transactionHistoryOfActiveTokens = await Promise.all(historyRecords);

      const attendedAuctionsTransactions = transactionHistoryOfActiveTokens
        .flat()
        .filter(
          (record) =>
            'auction_bid' in record.txn_type &&
            'buyer' in record.txn_type.auction_bid &&
            'principal' in record.txn_type.auction_bid.buyer &&
            record.txn_type.auction_bid.buyer.principal.toText() === principal.toText(),
        );
      const highestBidsMade = parseHighestSentBids(attendedAuctionsTransactions);
      debug.log('highestBids', highestBidsMade);
      const odcDataRaw = await actor?.nft_batch_origyn(activeTokens);
      if (odcDataRaw.err) {
        showUnexpectedErrorMessage(odcDataRaw.err);
      }
      const parsedOdcs = parseOdcs(odcDataRaw);
      const parsedActiveBids = parsedOdcs.map((odc: OdcDataWithSale, index) => {
        const bid = highestBidsMade[index];
        const bidAmount = 'auction_bid' in bid.txn_type && bid.txn_type.auction_bid.amount;
        const bidDecimals =
          'auction_bid' in bid.txn_type && bid.txn_type.auction_bid.token['ic'].decimals;
        return {
          ...odc,
          token_id: bid.token_id,
          latest_bid: toLargerUnit(Number(bidAmount), Number(bidDecimals)).toString(),
        };
      });

      debug.log('parsedActiveBids', parsedActiveBids);
      setSentActiveBids(parsedActiveBids);
    } catch (e) {
      showUnexpectedErrorMessage(e);
    } finally {
      setIsLoading(false);
    }
  };

  const getSentBidBalance = async () => {
    try {
      setIsLoading(true);
      const active: SaleInfoRequest = {
        active: [],
      };
      const salesInfo = await actor.sale_info_nft_origyn(active);
      if ('err' in salesInfo) {
        showUnexpectedErrorMessage(salesInfo.err);
      } else {
        const response: SaleInfoResponse = salesInfo.ok;
        if ('active' in response) {
          const activeSalesRecords = response.active.records
            .map((record) => {
              return record[1];
            })
            .filter((record) => record.length > 0);

          const activeAuctions = activeSalesRecords
            .map((record) => {
              if ('auction' in record[0].sale_type) {
                return record[0].sale_type.auction;
              }
            })
            .filter((auction) => auction !== undefined);
          debug.log('activeAuctions', activeAuctions);
          setActiveAuctions(activeAuctions);
        }
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
    if (activeAuctions?.length) {
      parseSentBids();
    }
  }, [activeAuctions]);

  return (
    <>
      {isLoading ? (
        <>
          <HR marginTop={24} marginBottom={24} />
          <LoadingContainer />
        </>
      ) : (
        <>
          {sentActiveBids?.length > 0 ? (
            <div>
              <HR marginTop={16} marginBottom={16} />
              <div style={styles.gridContainer}>
                {sentActiveBids.map((bid: any, index: number) => (
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
                      <p style={{ color: theme.colors.SECONDARY_TEXT }}>Your bid</p>
                      <TokenIcon symbol={bid.tokenSymbol} />
                      {bid.latest_bid.toString()}
                    </div>
                    <div style={styles.gridItem}>
                      <p style={{ color: theme.colors.SECONDARY_TEXT }}>Current Bid</p>
                      <TokenIcon symbol={bid.tokenSymbol} />
                      {toLargerUnit(bid.currentBid, Number(bid.token.decimals)).toString()}
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

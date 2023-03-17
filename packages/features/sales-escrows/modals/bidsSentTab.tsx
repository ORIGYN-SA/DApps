import React, { useState, useEffect, useContext } from 'react';
import { HR, theme } from '@origyn/origyn-art-ui';
import { TokenIcon } from '@dapp/features-components';
import { AuthContext } from '@dapp/features-authentication';
import { OdcDataWithSale, parseOdcs, toLargerUnit } from '@dapp/utils';
import { formatDistanceToNow } from 'date-fns';
import { PlaceholderIcon } from '@dapp/common-assets';
import { useDebug } from '@dapp/features-debug-provider';
import { EscrowRecord } from '@origyn/mintjs';
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
  amount: string;
  isNftOwner: boolean;
}

export const BidsSentTab = ({ collection, canisterId }: BidsSentTabProps) => {
  const debug = useDebug();
  const { principal } = useContext(AuthContext);
  const { getNftBatch, getNftBalances } = useApi();
  const { showUnexpectedErrorMessage } = useUserMessages();
  const [sentActivedBids, setSentActiveBids] = useState<SentActiveBidsProps[]>([]);
  const [bidsSent, setBidsSent] = useState<EscrowRecord[]>();
  const [isLoading, setIsLoading] = useState(false);

  const fetchBids = async () => {
    try {
      setIsLoading(true);
      const tokenIds = bidsSent.map((offer) => offer.token_id);
      const odcs = await getNftBatch(tokenIds);
      const parsedOdcs = parseOdcs(odcs);
      const parsedActiveBids = parsedOdcs
        .map((odc: OdcDataWithSale, index) => {
          const bid = bidsSent[index];
          return {
            ...odc,
            token_id: bid.token_id,
            amount: toLargerUnit(Number(bid.amount), Number(bid.token['ic'].decimals)).toString(),
            isNftOwner: odc.ownerPrincipalId == principal?.toText(),
          };
        })
        .filter((sentBid) => sentBid.auctionOpen && !sentBid.isNftOwner);
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
      const balances = await getNftBalances(principal);
      const sentEscrows = balances.escrow;
      const bidsSent = sentEscrows?.filter((element) => element.sale_id.length > 0);
      debug.log('bidsSent', bidsSent);
      setBidsSent(bidsSent);
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
    if (bidsSent?.length) {
      fetchBids();
    }
  }, [bidsSent]);

  return (
    <>
      {isLoading ? (
        <>
          <HR marginTop={24} marginBottom={24} />
          <LoadingContainer />
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
      )}
    </>
  );
};

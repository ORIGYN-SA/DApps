import React, { useState, useEffect, useContext } from 'react';
import { HR, theme } from '@origyn/origyn-art-ui';
import { TokenIcon } from '@dapp/features-components';
import { AuthContext } from '@dapp/features-authentication';
import { OdcDataWithSale, parseOdcs, toLargerUnit, parseTokenSymbol } from '@dapp/utils';
import { formatDistanceToNow } from 'date-fns';
import { PlaceholderIcon } from '@dapp/common-assets';
import { EscrowRecord } from '@origyn/mintjs';
import { useApi } from '@dapp/common-api';
import { LoadingContainer } from '@dapp/features-components';
import { useUserMessages } from '@dapp/features-user-messages';

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
  collection: any;
  canisterId: string;
}

interface ReceivedActiveBidsProps extends OdcDataWithSale {
  token_id: string;
  isNftOwner: boolean;
  escrow_record: EscrowRecord;
}

export const BidsReceivedTab = ({ collection, canisterId }: OffersTabProps) => {
  const { principal } = useContext(AuthContext);
  const { getNftBatch, getNftBalances } = useApi();
  const { showUnexpectedErrorMessage } = useUserMessages();
  const [receivedActivedBids, setReceivedActiveBids] = useState<ReceivedActiveBidsProps[]>([]);
  const [bidsReceived, setBidsReceived] = useState<EscrowRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBids = async () => {
    try {
      setIsLoading(true);
      const tokenIds = bidsReceived.map((offer) => offer.token_id);
      const odcs = await getNftBatch(tokenIds);
      const parsedOdcs = parseOdcs(odcs);

      const receivedActiveBids = parsedOdcs
        .map((odc: OdcDataWithSale, index) => {
          const bid = bidsReceived[index];
          return {
            ...odc,
            token_id: bid.token_id,
            isNftOwner: odc.ownerPrincipalId == principal?.toText(),
            escrow_record: bid,
          };
        })
        .filter((receivedBid) => receivedBid.auctionOpen && receivedBid.isNftOwner);

      setReceivedActiveBids(receivedActiveBids);
    } catch (e) {
      showUnexpectedErrorMessage(e);
    } finally {
      setIsLoading(false);
    }
  };

  const getBidsReceivedBalance = async () => {
    try {
      setIsLoading(true);
      const balances = await getNftBalances(principal);
      const offersAndBidsReceived = balances.offers;
      const bidsReceived = offersAndBidsReceived?.filter((element) => element.sale_id.length > 0);
      setBidsReceived(bidsReceived);
    } catch (e) {
      showUnexpectedErrorMessage(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBidsReceivedBalance();
  }, []);

  useEffect(() => {
    if (bidsReceived?.length) {
      fetchBids();
    }
  }, [bidsReceived]);

  return (
    <>
      {isLoading ? (
        <>
          <HR marginTop={24} />
          <LoadingContainer margin="24px" />
        </>
      ) : (
        <>
          {receivedActivedBids?.length > 0 ? (
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
                      <TokenIcon symbol={parseTokenSymbol(bid.escrow_record)} />
                      {toLargerUnit(bid.currentBid, Number(bid.token.decimals)).toFixed()}
                    </div>
                    <div style={styles.gridItem}>
                      <p style={{ color: theme.colors.SECONDARY_TEXT }}>Ends In</p>
                      <span>{formatDistanceToNow(Number(bid.auction.end_date / BigInt(1e6)))}</span>
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
      )}
    </>
  );
};

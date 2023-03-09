import React, { useState, useEffect, useContext } from 'react';
import { HR, theme } from '@origyn-sa/origyn-art-ui';
import { TokenIcon } from '@dapp/features-components';
import { AuthContext } from '@dapp/features-authentication';
import { OdcDataWithSale, parseOdcs, toLargerUnit } from '@dapp/utils';
import { formatDistanceToNow } from 'date-fns';
import { PlaceholderIcon } from '@dapp/common-assets';
import { useDebug } from '@dapp/features-debug-provider';
import { EscrowRecord, OrigynError, BalanceResponse } from '@dapp/common-types';

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
}

export const BidsSentTab = ({ collection, canisterId }: BidsSentTabProps) => {
  const debug = useDebug();
  const { actor, principal } = useContext(AuthContext);
  const [sentActivedBids, setSentActiveBids] = useState<SentActiveBidsProps[]>([]);
  const [bidsSent, setBidsSent] = useState<EscrowRecord[]>(); // [
  const currentTimeInNanos = BigInt(new Date().getTime() * 1e6);

  const parseBids = async () => {
    try {
      const tokenIds = bidsSent.map((offer) => offer.token_id);
      const odcDataRaw = await actor?.nft_batch_origyn(tokenIds);

      if (odcDataRaw.err) {
        throw new Error('Unable to retrieve metadata of tokens.');
      }

      const parsedOdcs = parseOdcs(odcDataRaw);
      const parsedActiveBids = parsedOdcs
        .map((odc: OdcDataWithSale, index) => {
          const bid = bidsSent[index];
          return {
            ...odc,
            token_id: bid.token_id,
            amount: toLargerUnit(Number(bid.amount), Number(bid.token['ic'].decimals)).toString(),
          };
        })
        .filter((sentBid) => sentBid.auction?.end_date > currentTimeInNanos);

      setSentActiveBids(parsedActiveBids);
    } catch (e) {
      debug.log(e);
    }
  };

  const getSentBidBalance = async () => {
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
        const sentEscrows = balanceResponse.escrow;
        const bidsSent = sentEscrows?.filter((element) => element.sale_id.length > 0);
        debug.log('bidsSent', bidsSent);
        setBidsSent(bidsSent);
      }
    } catch (e) {
      debug.log('error', e);
    }
  };

  useEffect(() => {
    getSentBidBalance();
  }, []);

  useEffect(() => {
    if (bidsSent?.length) {
      parseBids();
    }
  }, [bidsSent]);

  return (
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
  );
};

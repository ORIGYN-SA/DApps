import React, { useState, useEffect, useContext } from "react";
import { HR, theme } from "@origyn/origyn-art-ui";
import { TokenIcon } from "@dapp/features-components";
import { AuthContext } from "@dapp/features-authentication";
import {
  OdcDataWithSale,
  parseOdcs,
  toLargerUnit,
  getActiveAttendedAuctions,
  getTxOfActiveAttendedAuctions,
  getHighestSentBids,
  SentActiveBidsProps,
} from "@dapp/utils";
import { formatDistanceToNow } from "date-fns";
import { PlaceholderIcon } from "@dapp/common-assets";
import { useDebug } from "@dapp/features-debug-provider";
import { AuctionStateStable, TransactionRecord } from "@origyn/mintjs";
import { LoadingContainer } from "@dapp/features-components";
import { useUserMessages } from "@dapp/features-user-messages";
import { useApi } from "@dapp/common-api";
import { PerpetualOSContext } from "@dapp/features-context-provider";

const styles = {
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "42px 2fr repeat(3, 1fr)",
    gap: "8px",
    backgroundColor: "inherit",
    color: "inherit",
  },
  gridItem: {
    marginBottom: "auto",
    marginTop: "auto",
    verticalAlign: "middle",
  },
};

interface BidsSentTabProps {
  collection: any;
}

export const BidsSentTab = ({ collection }: BidsSentTabProps) => {
  const debug = useDebug();
  const { principal } = useContext(AuthContext);
  const { getNftBatch, getNftSaleInfo, getNftsHistory } = useApi();
  const { showUnexpectedErrorMessage } = useUserMessages();
  const [sentActivedBids, setSentActiveBids] = useState<SentActiveBidsProps[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [activeAttendedAuctions, setActiveAttendedAuctions] = useState<
    AuctionStateStable[]
  >([]);
  const context = useContext(PerpetualOSContext);

  const fetchSentBids = async () => {
    try {
      if (principal) {
        setIsLoading(true);
        debug.log("activeAttendedAuctions", activeAttendedAuctions);

        const activeNftHistory = await getNftsHistory(activeAttendedAuctions);
        debug.log("activeNftHistory", activeNftHistory);

        const activeAttendedAuctionsTx = getTxOfActiveAttendedAuctions(
          activeNftHistory,
          principal
        );
        debug.log("activeAttendedAuctionsTx", activeAttendedAuctionsTx);

        const highestBidsSent = getHighestSentBids(activeAttendedAuctionsTx);
        debug.log("highestBidsSent", highestBidsSent);

        const activeTokensIds = activeAttendedAuctionsTx.map(
          (tx: TransactionRecord) => tx.token_id
        );
        debug.log("activeTokensIds", activeTokensIds);

        const odcDataRaw = await getNftBatch(activeTokensIds);
        debug.log("odcDataRaw", odcDataRaw);

        const parsedOdcs = parseOdcs(odcDataRaw);
        debug.log("parsedOdcsBidSent", parsedOdcs);
        const parsedActiveBids = parsedOdcs
          .filter((odc: OdcDataWithSale) => odc.auctionOpen)
          .map((odc: OdcDataWithSale, index) => {
            const bid: TransactionRecord = highestBidsSent[index];
            debug.log("bid" + index, bid);
            const bidAmount =
              "auction_bid" in bid.txn_type && bid.txn_type.auction_bid.amount;
            const bidDecimals =
              "auction_bid" in bid.txn_type &&
              bid.txn_type.auction_bid.token["ic"].decimals;
            return {
              ...odc,
              token_id: bid.token_id,
              latest_bid: toLargerUnit(
                Number(bidAmount),
                Number(bidDecimals)
              ).toString(),
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
      if (principal) {
        setIsLoading(true);
        const salesInfo = await getNftSaleInfo();
        debug.log("salesInfo", salesInfo);
        if (salesInfo) {
          const activeAttendedAuctions = await getActiveAttendedAuctions(
            salesInfo,
            principal
          );
          debug.log("activeAttendedAuctions", activeAttendedAuctions);
          setActiveAttendedAuctions(activeAttendedAuctions);
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
    if (activeAttendedAuctions.length > 0) {
      fetchSentBids();
    }
  }, [activeAttendedAuctions]);

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
                {sentActivedBids.map(
                  (bid: SentActiveBidsProps, index: number) => (
                    <React.Fragment key={`${index}Row`}>
                      <div style={styles.gridItem}>
                        {bid.hasPreviewAsset ? (
                          <img
                            style={{
                              width: "42px",
                              borderRadius: "12px",
                              marginTop: "auto",
                              marginBottom: "auto",
                            }}
                            src={`${context.canisterUrl}/-/${bid.token_id}/preview`}
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
                        <span style={{ color: theme.colors.SECONDARY_TEXT }}>
                          {collection.name}
                        </span>
                      </div>
                      <div style={styles.gridItem}>
                        <p style={{ color: theme.colors.SECONDARY_TEXT }}>
                          Your Bid
                        </p>
                        <TokenIcon symbol={bid.tokenSymbol} />
                        {bid.latest_bid}
                      </div>
                      <div style={styles.gridItem}>
                        <p style={{ color: theme.colors.SECONDARY_TEXT }}>
                          Current Bid
                        </p>
                        <TokenIcon symbol={bid.tokenSymbol} />
                        {toLargerUnit(
                          bid.currentBid,
                          Number(bid.token.decimals)
                        ).toFixed()}
                      </div>
                      <div style={styles.gridItem}>
                        <p style={{ color: theme.colors.SECONDARY_TEXT }}>
                          Ends In
                        </p>
                        {bid.auction &&
                          formatDistanceToNow(
                            Number(bid.auction.end_date / BigInt(1e6))
                          )}
                      </div>
                    </React.Fragment>
                  )
                )}
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

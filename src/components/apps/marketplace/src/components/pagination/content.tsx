import React, { useContext } from "react";
import { Card, Container, Flex, Grid, Image } from "@origyn/origyn-art-ui";
import { useMarketplace } from "../../components/context";
import { OdcDataWithSale, toLargerUnit } from "@dapp/utils";
import { Link } from "react-router-dom";
import { PlaceholderIcon } from "@dapp/common-assets";
import { TokenIcon } from "@dapp/features-components";
import { PerpetualOSContext } from "@dapp/features-context-provider";

interface NFTCardsProps {
  nftData: Array<any>;
  odcs: Array<any>;
}

const NFTCards = ({ nftData, odcs }: NFTCardsProps) => {
  const context = useContext(PerpetualOSContext);
  const { state } = useMarketplace();
  const { collectionData } = state;

  const getPrice = (odc: OdcDataWithSale): string => {
    if (!odc.token) {
      throw new Error("Token is undefined");
    }

    const price = odc.currentBid
      ? toLargerUnit(odc.currentBid, odc.token.decimals)
      : toLargerUnit(odc.buyNow, odc.token.decimals);
    return price.toFixed();
  };

  return (
    <div>
      {nftData?.length > 0 ? (
        <>
          <Grid
            smColumns={1}
            mdColumns={2}
            lgColumns={3}
            xlColumns={4}
            columns={6}
            gap={20}
          >
            {nftData.map((odc: OdcDataWithSale) => {
              return (
                <Link to={`/${odc?.id}`} key={odc?.id}>
                  <Card
                    flexFlow="column"
                    style={{ overflow: "hidden", height: "100%" }}
                    bgColor="NAVIGATION_BACKGROUND"
                  >
                    {odc.hasPreviewAsset ? (
                      <Image
                        style={{ width: "100%" }}
                        src={`${context.assetCanisterUrl}/-/${odc?.id}/preview`}
                        alt=""
                      />
                    ) : (
                      <Flex align="center" justify="center">
                        <PlaceholderIcon width={"100%"} />
                      </Flex>
                    )}
                    <Container
                      style={{ height: "100%" }}
                      size="full"
                      padding="16px"
                    >
                      <Flex
                        style={{ height: "100%" }}
                        justify="space-between"
                        flexFlow="column"
                        gap={32}
                      >
                        <div>
                          <p style={{ fontSize: "12px", color: "#9A9A9A" }}>
                            {collectionData?.displayName}
                          </p>
                          <p>
                            <b>{odc?.displayName || odc?.id}</b>
                          </p>
                        </div>
                        <div>
                          <p style={{ fontSize: "12px", color: "#9A9A9A" }}>
                            Status
                          </p>
                          <p>
                            {odc.auctionOpen ? (
                              <>
                                {getPrice(odc)}{" "}
                                <TokenIcon symbol={odc.tokenSymbol} />
                              </>
                            ) : (
                              "No auction started"
                            )}
                          </p>
                        </div>
                      </Flex>
                    </Container>
                  </Card>
                </Link>
              );
            })}
          </Grid>
          <br />
        </>
      ) : (
        <h5>
          {odcs?.length === 0
            ? "There are no digital certificates in this collection"
            : "Your filter returned 0 digital certificates"}
        </h5>
      )}
    </div>
  );
};

export default NFTCards;

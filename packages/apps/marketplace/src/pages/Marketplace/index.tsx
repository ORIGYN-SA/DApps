import React from 'react';
import { ICPIcon, OGYIcon } from '@dapp/common-assets';
import { AuthContext, useRoute, useSessionContext } from '@dapp/features-authentication';
import { LoadingContainer } from '@dapp/features-components';
import { useContext, useEffect, useState } from 'react';
import {
  Card,
  Container,
  Flex,
  HR,
  Grid,
  Image,
  SecondaryNav,
  ShowMoreBlock,
} from '@origyn-sa/origyn-art-ui';
import Filter from '../../../../wallet/src/pages/Wallet/Filter';
import { getNftCollectionMeta, OrigynClient } from '@origyn-sa/mintjs';
import { useDialog } from '@connect2ic/react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const SymbolWithIcon = ({ symbol }: any) =>
  symbol === 'OGY' ? (
    <>
      <OGYIcon
        style={{
          verticalAlign: 'middle',
          width: '20px',
          height: '20px',
          marginRight: '3px',
          borderRadius: '25px',
          backgroundColor: 'black',
        }}
      />{' '}
      {symbol}
    </>
  ) : (
    <>
      <ICPIcon
        style={{
          verticalAlign: 'middle',
          width: '20px',
          height: '20px',
          marginRight: '3px',
          borderRadius: '25px',
          backgroundColor: 'black',
        }}
      />{' '}
      {symbol}
    </>
  );

const StyledSectionTitle = styled.h2`
  margin: 48px 24px;
`;

const Marketplace = () => {
  const { localDevelopment } = useSessionContext();
  const { principal, actor, handleLogOut } = useContext(AuthContext);
  const [canisterId, setCanisterId] = useState('');
  const [NFTData, setNFTData] = useState<any>([]);
  const [filteredNFTs, setFilteredNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [onSale, setOnSale] = useState(true);
  const [minPrice, setMinPrice] = useState<any>(0);
  const [maxPrice, setMaxPrice] = useState<any>(0);
  const [collectionData, setCollectionData] = React.useState<any>();
  const [collectionPreview, setCollectionPreview] = React.useState<any>();
  const [filter, setFilter] = useState<any>();
  const [sort, setSort] = useState<any>();
  const [inputText, setInputText] = useState('');
  const [total, setTotal] = useState(0);
  const [filteredNFTData, setFilteredNFTData] = useState<any>([]);
  const { open } = useDialog();
  const navigate = useNavigate();

  const fetchData = async () => {
    if (actor) {
      setIsLoading(true);

      useRoute().then(({ canisterId }) => {
        setCanisterId(canisterId);
        OrigynClient.getInstance().init(true, canisterId);

        getNftCollectionMeta([]).then((r: any) => {
          if ('err' in r) {
          } else {
            setCollectionPreview(
              Object.values(
                r.ok.metadata[0].Class.find(({ name }) => name === 'preview_asset').value,
              )[0],
            );
            setCollectionData(
              r.ok.metadata[0].Class.find(({ name }) => name === '__apps')
                .value.Array.thawed[0].Class.find(({ name }) => name === 'data')
                .value.Class.reduce(
                  (arr, val) => ({ ...arr, [val.name]: Object.values(val.value)[0] }),
                  {},
                ),
            );
          }
        });
      });
      actor?.collection_nft_origyn([]).then(async (response) => {
        console.log('collection_nft_origyn', response);
        if ('err' in response) throw new Error(Object.keys(response.err)[0]);

        setTotal(response?.ok?.token_ids[0]?.length);

        actor
          ?.nft_batch_origyn(response?.ok?.token_ids[0])
          .then((r) => {
            if ('err' in r) throw new Error();
            console.log(r);
            const parsedData = r.map((it) => {
              console.log(it);
              const openSale =
                it?.ok?.current_sale[0]?.sale_type?.auction?.status?.hasOwnProperty('open');
              const sale = it?.ok?.current_sale[0]?.sale_type?.auction?.current_bid_amount;
              const nftID = it?.ok?.metadata.Class.find(({ name }) => name === 'id').value.Text;
              const dataObj = it?.ok?.metadata.Class.find(({ name }) => name === '__apps')
                .value.Array.thawed[0].Class.find(({ name }) => name === 'data')
                .value.Class.reduce(
                  (arr, val) => ({ ...arr, [val.name]: Object.values(val.value)[0] }),
                  {},
                );
              const filterSale = Number(sale);
              return {
                ...dataObj,
                id: { nftID: nftID, sale: filterSale, open: openSale },
              };
            });

            setNFTData(parsedData);
            setFilteredNFTData(parsedData);
            setIsLoading(false);
          })
          .catch(() => {
            setIsLoading(false);
          });
      });
    }
  };

  useEffect(() => {
    document.title = 'Origyn Marketplace';
    useRoute().then(({ canisterId }) => {
      setCanisterId(canisterId);
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, [actor]);

  useEffect(() => {
    let filtered = NFTData;

    switch (filter) {
      case 'onSale':
        filtered = filtered.filter((nft) => !isNaN(nft?.id?.sale));
        break;
      case 'notOnSale':
        filtered = filtered.filter((nft) => isNaN(nft?.id?.sale));
        break;
    }

    switch (sort) {
      case 'saleASC':
        filtered = [...filtered].sort((nft, nft2) =>
          isNaN(nft?.id?.sale) ? 1 : isNaN(nft2?.id?.sale) ? -1 : nft?.id?.sale - nft2?.id?.sale,
        );
        break;
      case 'saleDESC':
        filtered = [...filtered].sort((nft, nft2) =>
          isNaN(nft2?.id?.sale) ? -1 : isNaN(nft?.id?.sale) ? 1 : nft2?.id?.sale - nft?.id?.sale,
        );
        break;
    }

    if (inputText === '') {
      filtered = filtered;
    } else {
      filtered = filtered.filter((nft) => nft?.display_name.toLowerCase().includes(inputText));
    }

    setFilteredNFTData(filtered);
  }, [filter, sort, inputText]);

  useEffect(() => {
    const tmpFiltered = [...(NFTData || [])];
    const filtered = tmpFiltered.filter((item) => {
      if (onSale) {
        const currentOpenAuction = item?.current_sale?.find((sale) =>
          sale?.sale_type?.auction?.status?.hasOwnProperty('open'),
        );
        console.log(currentOpenAuction);
        return currentOpenAuction;
      }
      return true;
    });
    // console.log(filtered);
    setFilteredNFTs(filtered);
  }, [onSale, minPrice, maxPrice, NFTData]);

  return (
    <Flex fullWidth padding="0" flexFlow="column">
      <SecondaryNav
        title="Marketplace"
        tabs={[{ title: 'Marketplace', id: 'Marketplace' }]}
        content={[
          <Flex fullWidth flexFlow="column">
            <StyledSectionTitle>Marketplace Dashboard</StyledSectionTitle>
            <HR />
            {isLoading ? (
              <LoadingContainer />
            ) : (
              <div>
                <Container padding="32px">
                  <Flex align="flex-start" gap={24}>
                    <Image
                      src={`https://prptl.io/-/${canisterId}/collection/-/${collectionPreview}`}
                      alt=""
                      style={{ width: 200 }}
                    />
                    <Flex flexFlow="column" justify="space-between" gap={8}>
                      <h2>
                        <b>{collectionData?.display_name}</b>
                      </h2>
                      <p>
                        <span className="secondary_color">Created by</span>
                        <span className="secondary_color">
                          {collectionData?.creator_name
                            ? collectionData?.creator_name
                            : `${collectionData?.creator_principal?.toString()} (no creator_name)`}
                        </span>
                      </p>
                      <br />
                      <Flex>
                        <Flex flexFlow="column">
                          <h5>{total}</h5>
                          <p className="secondary_color">Total Items</p>
                        </Flex>
                      </Flex>
                      <br />
                      <ShowMoreBlock btnText="Read More">
                        <p className="secondary_color">{collectionData?.description}</p>
                      </ShowMoreBlock>
                      <br />
                      <br />
                    </Flex>
                  </Flex>
                </Container>
                <HR />
                <Container padding="32px">
                  <Filter
                    onChangeFilter={setFilter}
                    onChangeSort={setSort}
                    onInput={setInputText}
                  />
                  <br />
                  <br />
                  {NFTData?.length > 0 ? (
                    <>
                      <Grid
                        smColumns={1}
                        mdColumns={2}
                        lgColumns={3}
                        xlColumns={4}
                        columns={6}
                        gap={20}
                      >
                        {filteredNFTData.map((nft: any) => {
                          // const currentOpenAuction = nft?.current_sale?.find((sale) =>
                          //   sale?.sale_type?.auction?.status?.hasOwnProperty('open'),
                          // );
                          return (
                            <a
                              href=""
                              onClick={(e) => {
                                e.preventDefault();
                                navigate(`/${nft.id?.nftID}`);
                              }}
                              key={nft.id?.nftID}
                            >
                              <Card
                                flexFlow="column"
                                style={{ overflow: 'hidden', height: '100%' }}
                              >
                                <img
                                  style={{ width: '100%' }}
                                  src={`https://${canisterId}.raw.ic0.app/-/${nft.id?.nftID}/preview`}
                                  alt=""
                                />
                                <Container style={{ height: '100%' }} size="full" padding="16px">
                                  <Flex
                                    style={{ height: '100%' }}
                                    justify="space-between"
                                    flexFlow="column"
                                    gap={32}
                                  >
                                    <div>
                                      <p style={{ fontSize: '12px', color: '#9A9A9A' }}>
                                        {collectionData?.display_name}
                                      </p>
                                      <p>
                                        <b>{nft['display_name']}</b>
                                      </p>
                                    </div>
                                    <div>
                                      <p style={{ fontSize: '12px', color: '#9A9A9A' }}>Status</p>
                                      <p>{nft.id.open ? nft.id.sale : 'No auction started'}</p>
                                    </div>
                                  </Flex>
                                </Container>
                              </Card>
                            </a>
                          );
                        })}
                      </Grid>
                      <br />
                    </>
                  ) : (
                    <h5>There are no NFTs in this collection</h5>
                  )}
                </Container>
              </div>
            )}
          </Flex>,
        ]}
        onLogOut={handleLogOut}
        onConnect={open}
        principal={principal?.toText() === '2vxsx-fae' ? '' : principal?.toText()}
      />
    </Flex>
  );
};

export default Marketplace;

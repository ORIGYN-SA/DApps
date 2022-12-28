import { Box } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import {
  Button,
  Card,
  Flex,
  Grid,
  HR,
  Icons,
  SecondaryNav,
  Select,
  TabContent,
  TextInput,
  Container, Banner, ShowMoreBlock,
} from '@origyn-sa/origyn-art-ui'
import { useParams } from 'react-router-dom'
import { LoadingContainer, TokenIcon } from '../../../../../features/components'
import { getDiffInDays, timeConverter } from '../../../../../utils'

const WalletPage = () => {
  const [loggedIn, setLoggedIn] = useState('');
  const [nftData, setNftData] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);
  const { nft_id } = useParams();

  const handleLogOut = () => {
    setLoggedIn("");
  }

  const fetchData = async () => {
    const response = await fetch(`https://development.origyn.network/canister/v0/nft-token/${nft_id}`, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
        'x-api-key': loggedIn
      },
    });
    const data = await response.json();
    console.log(data);
    setNftData(data);
    setIsLoading(false);
    return data;
  }

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <>
      {
        isLoading ? (
          <LoadingContainer />
        ) : (
          <Flex fullWidth padding='0' flexFlow='column'>
            <SecondaryNav
              title='Vault'
              tabs={[
                { title: 'NFT Details', id: 'NFTs' },
              ]}
              content={[
                <>
                  <Flex flexFlow="column" gap={8}>
                    <Container size="md" padding="80px" mdPadding="16px">
                      <Grid columns={2} mdColumns={2} gap={120} smGap={16} mdGap={40}>
                        <img
                          style={{ borderRadius: '18px', width: '100%' }}
                          src={nftData.previewUrl}
                        />
                        <Flex flexFlow="column" gap={8}>
                          <p className="secondary_color">Token ID</p>
                          <h2>
                            <b>{nftData?.tokenId}</b>
                          </h2>
                          <Flex align="center" justify="space-between">
                            <div>
                              <p className="secondary_color">Status</p>
                              <p>{nftData?.status}</p>
                            </div>
                            {
                              nftData.status === "SUCCESS" && (
                                <div>
                                  <p className="secondary_color">Minted to</p>
                                  <p title={nftData?.targetOwnerPrincipalId}>
                                    {nftData?.targetOwnerPrincipalId.substring(0, 8)}...
                                  </p>
                                </div>
                              )
                            }
                          </Flex>
                          <br />
                          <ShowMoreBlock btnText="Read More">
                            <p className="secondary_color">{nftData?.description}</p>
                          </ShowMoreBlock>
                          <Button disabled>Connect with QR</Button>
                        </Flex>
                      </Grid>
                    </Container>
                    <Banner bgColor="PRIMARY_1000" style={{ display: 'block' }} padding="0">
                      <TabContent
                        fullWidth
                        borderBottom
                        tabs={[
                          { title: 'Details', id: 'details' },
                          { title: 'History', id: 'history' },
                        ]}
                        content={[
                          <Container size="sm" padding="32px" smPadding="16px">
                            {Object.keys(nftData)
                              .map((k) => (
                                <div key={k}>
                                  <Grid columns={2}>
                                    <p>{k.charAt(0).toUpperCase() + k.slice(1)}</p>
                                    <p className="secondary_color">{nftData[k]?.toString()}</p>
                                  </Grid>
                                  <HR marginTop={16} />
                                </div>
                              ))}
                          </Container>,
                          <Container size="sm" padding="32px" smPadding="16px">
                            <Flex flexFlow="column" gap={16}>
                              {
                                nftData.statusHistory.map((hItem) => {
                                  const createDate = new Date(hItem.createdAt)
                                  const updateDate = new Date(hItem.updatedAt)
                                  return <Card padding="16px" justify="space-between">
                                    <div>
                                      <p className="secondary_color">Status</p>
                                      <p>{hItem.status}</p>
                                    </div>
                                    <div>
                                      <p className="secondary_color">Created at</p>
                                      <p>{timeConverter(BigInt(createDate.valueOf()) * 1000000n)}</p>
                                    </div>
                                    <div>
                                      <p className="secondary_color">Updated at</p>
                                      <p>{timeConverter(BigInt(updateDate.valueOf()) * 1000000n)}</p>
                                    </div>
                                  </Card>
                                })
                              }
                            </Flex>
                          </Container>,
                        ]}
                      />
                    </Banner>
                  </Flex>
                </>,
                <Container>

                </Container>
              ]}
              onLogOut={handleLogOut}
              principal={loggedIn}
            />
          </Flex>
        )
      }
    </>
  )
}

export default WalletPage

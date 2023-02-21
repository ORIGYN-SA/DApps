/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Flex,
  Grid,
  HR,
  SecondaryNav,
  TabContent,
  Container,
  Banner,
  ShowMoreBlock,
  Icons,
} from '@origyn-sa/origyn-art-ui';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { LoadingContainer } from '../../../../../features/components';
import { timeConverter } from '../../../../../utils';
import Certificate from '../../../../luxury/src/components/Certificate';
import SquareIcon from '@mui/icons-material/Square';
import PlayForWorkIcon from '@mui/icons-material/PlayForWork';
import { CandyToJson } from '../../../../../utils/src/candyParser';
import { formTemplate } from '../../../../MintingB2B/src/pages/Main/Tabs/Minter';
import { RenderDetails } from '../../../../MintingB2B/src/pages/NFTDetails';

const WalletPage = () => {
  const [loggedIn, setLoggedIn] = useState('');
  const [nftData, setNftData] = useState<any>();
  const [templateFormData, setTemplateFormData] = useState<any>(
    JSON.parse(localStorage.getItem('formTemplate')) || formTemplate,
  );
  const [libraries, setLibraries] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMinting, setIsMinting] = useState(false);
  const [canisterId, setCanisterId] = useState("");
  const [normalData, setNormalData] = useState<any>();
  const {nft_id} = useParams();
  const handleLogOut = () => {
    setLoggedIn('');
  };

  const fetchData = async () => {
    const urlSearchParams = new URLSearchParams(window.location.href?.split('?')[1]);
    const { tokenId, b2bCanisterId, canisterId } = Object.fromEntries(urlSearchParams.entries());

    console.log(tokenId, b2bCanisterId);
    const responseNormalData = await fetch(
      `https://development.canister.origyn.ch/canister/v0/nft-token/${nft_id}/`,
      {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'x-access-token': loggedIn,
        },
      },
    );
    setCanisterId(canisterId);

    const data = await responseNormalData.json();

    console.log(data, "data");
    setNormalData(data);
    const response = await fetch(
      `https://development.canister.origyn.ch/canister/v0/nft-token/${nft_id}/metadata`,
      {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'x-access-token': loggedIn,
        },
      },
    );
    const metadata = await response.json();
    console.log(metadata, "metadata");
    setLibraries(metadata.metadata.library);
    try {
      const toJS = new CandyToJson(metadata);
      setNftData(toJS.getAllDataFields());
    } catch (e) {
      console.log(e);
      setNftData({});
    }
    setIsLoading(false);
    return data;
  };

  const downloadFile = async (url: string, fileName: string) => {
    const response = await fetch(url, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'x-api-key': loggedIn,
      },
    });
    const data = await response.blob();

    const downloadUrl = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {isLoading || isMinting ? (
        <LoadingContainer />
      ) : (
        <Flex fullWidth padding="0" flexFlow="column">
          <SecondaryNav
            title="Vault"
            tabs={[{ title: 'NFT Details', id: 'NFTs' }]}
            content={[
              <>
                <Flex flexFlow="column" gap={8}>
                  <Container size="md" padding="50px">
                    <Grid columns={2} mdColumns={2} gap={120} smGap={16} mdGap={40}>
                      <img
                        style={{ borderRadius: '18px', width: '100%' }}
                        src={`https://${canisterId}.raw.ic0.app/-/${nft_id}/preview`}
                        alt=''
                        />
                      <Flex flexFlow="column" gap={8} justify="center">
                        <p className="secondary_color">Token ID</p>
                        <h2>
                          <b>{normalData?.tokenId}</b>
                        </h2>
                        <br />

                        <Flex align="center" justify="space-between">
                          <Flex flexFlow="column" gap={8}>
                            <p className="secondary_color">Status</p>
                            <p className="secondary_color">{normalData?.status}</p>
                          </Flex>
                          {normalData.status === "SUCCESS" && (
                            <Flex flexFlow="column" gap={8}>
                              <p className="secondary_color">Minted to</p>
                              <p title={normalData?.targetOwnerPrincipalId}>
                                {normalData?.targetOwnerPrincipalId.substring(0, 8)}...
                              </p>
                            </Flex>
                          )}
                        </Flex>
                        <br />
                        <ShowMoreBlock btnText="Read More">
                          <p className="secondary_color">{normalData?.description}</p>
                        </ShowMoreBlock>
                      </Flex>
                    </Grid>
                  </Container>
                  <Banner bgColor="PRIMARY_1000" style={{ display: 'block' }} padding="0">
                    <TabContent
                      fullWidth
                      borderBottom
                      tabs={[
                        { title: 'Details', id: 'details' },
                        { title: 'Origyn Certificate', id: 'certificate' },
                        { title: 'Additional Info', id: 'additional' },
                      ]}
                      content={[
                        <Container size="sm" padding="32px" smPadding="16px">
                          <br />

                          <Flex flexFlow="column" gap={24}>
                            {Object.keys(nftData)?.map((k) => (
                              <React.Fragment key={k}>
                                <Flex align="center" justify="space-between">
                                  <p>{k}</p>

                                  <p style={{ textAlign: 'end' }} className="secondary_color">
                                    {nftData[k]?.toString()}
                                  </p>
                                </Flex>
                                <HR />
                              </React.Fragment>
                            ))}
                          </Flex>
                          {/* <RenderDetails data={nftData} /> */}
                          <br />
                          {/* In here the array of the information of the Diamon NFT */}
                        </Container>,
                        <Container size="sm" padding="32px" smPadding="16px">
                          <h2 style={{ textAlign: 'center' }}>Origyn Certificate</h2>
                          <br />
                          <Certificate
                            data={{
                              Name: nftData.name,
                              'Date Minted': normalData?.createdAt ? new Date(normalData?.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
                              'Owner Principal ID': normalData?.targetOwnerPrincipalId,
                              'Canister ID': canisterId,
                            }}
                          />
                        </Container>,

                        <Container size="sm" padding="32px" smPadding="16px">
                          <h2 style={{ textAlign: 'center' }}>Digital Media</h2>
                          <br />
                          <Container size="md" padding="50px">
                            <Grid columns={2} mdColumns={2} gap={120} smGap={16} mdGap={40}>
                              {libraries.map((l, k) => {
                                return (
                                  <img
                                    key={k}
                                    src={l?.library_file}
                                    style={{ borderRadius: '12px' }}
                                  />
                                );
                              })}
                            </Grid>
                          </Container>

                          <h2 style={{ textAlign: 'center' }}>Documents</h2>
                          <br />
                          <Container size="md" padding="50px">
                            <Grid columns={2} mdColumns={2} gap={50} smGap={16} mdGap={40}>
                              {libraries.map((e, k) => {
                                console.log(e);
                                return (
                                  <Card key={k} padding="16px" align="center" justify="space-between" gap={16}>
                                    <Flex gap={12} align="center">
                                      <Flex flexFlow="column">
                                        <p><b>{e.library_id}</b></p>
                                      </Flex>
                                    </Flex>
                                    <Button
                                      textButton
                                      iconButton
                                      onClick={() => downloadFile(e.library_file, e.library_id)}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18">
                                        <path d="M9.5 12.0001C9.2875 12.0001 9.1095 11.9281 8.966 11.7841C8.822 11.6406 8.75 11.4626 8.75 11.2501V5.8876L7.34375 7.29385C7.19375 7.44385 7.01875 7.51885 6.81875 7.51885C6.61875 7.51885 6.4375 7.4376 6.275 7.2751C6.125 7.1251 6.05325 6.94685 6.05975 6.74035C6.06575 6.53435 6.1375 6.3626 6.275 6.2251L8.975 3.5251C9.05 3.4501 9.13125 3.39685 9.21875 3.36535C9.30625 3.33435 9.4 3.31885 9.5 3.31885C9.6 3.31885 9.69375 3.33435 9.78125 3.36535C9.86875 3.39685 9.95 3.4501 10.025 3.5251L12.725 6.2251C12.875 6.3751 12.9467 6.5531 12.9403 6.7591C12.9342 6.9656 12.8625 7.1376 12.725 7.2751C12.575 7.4251 12.397 7.5031 12.191 7.5091C11.9845 7.5156 11.8062 7.44385 11.6562 7.29385L10.25 5.8876V11.2501C10.25 11.4626 10.1783 11.6406 10.0347 11.7841C9.89075 11.9281 9.7125 12.0001 9.5 12.0001ZM5 15.0001C4.5875 15.0001 4.2345 14.8533 3.941 14.5598C3.647 14.2658 3.5 13.9126 3.5 13.5001V12.0001C3.5 11.7876 3.57175 11.6093 3.71525 11.4653C3.85925 11.3218 4.0375 11.2501 4.25 11.2501C4.4625 11.2501 4.64075 11.3218 4.78475 11.4653C4.92825 11.6093 5 11.7876 5 12.0001V13.5001H14V12.0001C14 11.7876 14.072 11.6093 14.216 11.4653C14.3595 11.3218 14.5375 11.2501 14.75 11.2501C14.9625 11.2501 15.1405 11.3218 15.284 11.4653C15.428 11.6093 15.5 11.7876 15.5 12.0001V13.5001C15.5 13.9126 15.3533 14.2658 15.0597 14.5598C14.7657 14.8533 14.4125 15.0001 14 15.0001H5Z" />
                                      </svg>
                                    </Button>
                                  </Card>
                                );
                              })}
                            </Grid>
                          </Container>

                          <Flex flexFlow="column" gap={16}>
                            <h2 style={{ textAlign: 'center' }}>History</h2>
                            <br />
                            {normalData?.statusHistory.map((hItem, k) => {
                              const createDate = new Date(hItem.createdAt);
                              return (
                                <React.Fragment key={k}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <p className="secondary_color">{hItem.status}</p>
                                    <p>{timeConverter(BigInt(createDate.valueOf()) * 1000000n)}</p>
                                  </div>
                                  <HR />
                                </React.Fragment>
                              );
                            })}
                          </Flex>
                        </Container>,
                      ]}
                    />
                  </Banner>
                </Flex>
              </>,
            ]}
            onLogOut={handleLogOut}
            principal={loggedIn}
          />
        </Flex>
      )}
    </>
  );
};

export default WalletPage;

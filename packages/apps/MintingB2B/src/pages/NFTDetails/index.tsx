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
import { ConnectQRModal } from '../../modals/ConnectQRModal';
import Certificate from '../../../../luxury/src/components/Certificate';
import SquareIcon from '@mui/icons-material/Square';
import PlayForWorkIcon from '@mui/icons-material/PlayForWork';
import { CandyToJson } from '../../../../../utils/src/candyParser';
import { formTemplate } from '../Main/Tabs/Minter';
import { SendCertificateToPrincipal } from '../../modals/SendCertificateToPrincipal';
import { STATUSES } from '../../constants/minting';
import { PreviewImage } from '../../components/lists/FilesList';

const RenderDetails = ({ data }) => {
  const FT = JSON.parse(localStorage.getItem('formTemplate')) || formTemplate;
  console.log(FT,Object.keys(FT)[0], data);

  return (
    <Flex flexFlow="column" gap={16}>
      {FT[Object.keys(FT)[0]]?.map((item, k) => {
        return (
          <Flex key={k} flexFlow="column" gap={24}>
            <Flex flexFlow="column" align="center" justify="center">
              <br />
              <h4>{item.title}</h4>
              <br />
            </Flex>
            {item?.fields?.map((f, k) => (
              <React.Fragment key={k}>
                <Flex align="center" justify="space-between">
                  <p>{f.label}</p>

                  <p style={{ textAlign: 'end' }} className="secondary_color">
                    {data[f.name]?.toString()}
                  </p>
                </Flex>
                <HR />
              </React.Fragment>
            ))}
          </Flex>
        );
      })}
    </Flex>
  );
};

const WalletPage = () => {
  const [loggedIn, setLoggedIn] = useState('');
  const [nftData, setNftData] = useState<any>();
  const [libraries, setLibraries] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [isSendOpen, setIsSendOpen] = useState(false);
  const { nft_id } = useParams();
  const [normalData, setNormalData] = useState<any>();
  const navigate = useNavigate();
  const handleLogOut = () => {
    setLoggedIn('');
  };

  const fetchData = async () => {
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
    
    const data = await responseNormalData.json();

    console.log(data, "data");
    setNormalData(data);
    if ('prestage' in data) {
      setNftData(data.prestage.data);
      setLibraries(data.prestage.data.files);
      setIsLoading(false);
      return data;
    } else {
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
      } catch (e){
        console.log(e);
        setNftData({});
      }
      setIsLoading(false);
      return data;
    }
  };

  const stageCertificate = async () => {
    setIsMinting(true);
    const requestFormData = new FormData();
    requestFormData.set('appType', 'IGI');

    console.log(nftData);
    const jsonFile = new Blob([JSON.stringify({...nftData, display: {}}, null, 2)], {
      type: 'application/json',
    });

    const file = new File([jsonFile], 'metadata.json', {
      type: 'application/json',
      lastModified: Date.now(),
    });
    
    requestFormData.set('metadata', file);

    console.log();
    const response = await fetch(`https://development.origyn.network/canister/v0/nft-token`, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'x-access-token': loggedIn,
      },
      body: requestFormData,
    });
    if (response.status === 200) {
      const data = await response.json();
      navigate(`/${data?.token?.id}`);
      console.log(data);
    }
    setIsMinting(false);
  }

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

  function mapStatus(status) {
    switch (status) {
      case STATUSES.waitingForOwner:
        return 'Waiting For Owner';
      case STATUSES.success:
        return 'Success';
      case STATUSES.failed:
        return 'Failed';
      case STATUSES.inProgress:
        return 'In Progress';
      case STATUSES.preStage:
        return 'Pre-Stage';
      case STATUSES.pending:
        return 'Pending';
      case STATUSES.assignedQR:
        return 'Waiting for QR claim';
      default:
        return 'Error';
    }
  }

  const handleClaim = async () => {
    const responseNormalData = await fetch(
      `https://development.canister.origyn.ch/canister/v0/token/code/${nft_id}`,
      {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'x-access-token': loggedIn,
        },
      },
    );
    const {code} = await responseNormalData.json();
    console.log(code);
    console.log(window.location.href.replace('mintingB2B.html', `claiming.html?tokenId=${nft_id}&code=${code}`));

    window.location.href = window.location.href.replace('mintingB2B.html', `claiming.html?tokenId=${nft_id}&code=${code}`)
  }

  useEffect(() => {
    if (parseInt(localStorage.getItem('keyExpiration')) < (new Date).getTime()) {
      localStorage.setItem('apiKey', "");
      navigate("/");
    } else {
      setLoggedIn(localStorage.getItem('apiKey'));
    }
    fetchData();
  }, [nft_id]);

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
                      <img style={{ borderRadius: '18px', width: '100%' }} src={libraries[0]?.library_file || libraries[0]?.source} />
                      <Flex flexFlow="column" gap={8} justify="center">
                        <p className="secondary_color">Token ID</p>
                        <h2>
                          <b>{normalData?.tokenId}</b>
                        </h2>
                        <Flex align="center" justify="space-between">
                          <div>
                            <p className="secondary_color">Status</p>
                            <p style={{ color: '#DD1422' }}>{mapStatus(normalData?.status)}</p>
                          </div>
                          {normalData.status === STATUSES.success && (
                            <div>
                              <p className="secondary_color">Minted to</p>
                              <p title={normalData?.targetOwnerPrincipalId}>
                                {normalData?.targetOwnerPrincipalId.substring(0, 8)}...
                              </p>
                            </div>
                          )}
                        </Flex>
                        <br />
                        <ShowMoreBlock btnText="Read More">
                          <p className="secondary_color">{normalData?.description}</p>
                        </ShowMoreBlock>
                        {
                          normalData.status === STATUSES.preStage && (
                            <Grid columns={2} gap={16}>
                              <Button
                                btnType="filled"
                                style={{ width: "100%" }}
                              >
                                Edit
                              </Button>
                              <Button
                                btnType="outlined"
                                style={{ width: "100%" }}
                                onClick={stageCertificate}
                              >
                                Stage
                              </Button>
                            </Grid>  
                          )
                        }
                        {
                          normalData.status === STATUSES.waitingForOwner && (
                            <Grid columns={1} gap={16}>
                              <Button
                                onClick={() => setIsOpen(true)}
                                btnType="outlined"
                                style={{ width: "100%" }}
                              >
                                Transfer Ownership
                              </Button>
                              {/* <Button
                                onClick={() => setIsSendOpen(true)}
                                btnType="outlined"
                                style={{ width: "100%" }}
                              >
                                Send to Principal
                              </Button> */}
                            </Grid>
                          )
                        }
                        {
                          normalData.status === STATUSES.assignedQR && (
                            <Grid columns={1} gap={16}>
                              {/* <QRCode
                                size={256}
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                value={value}
                                viewBox={`0 0 256 256`}
                              /> */}
                              <Button onClick={handleClaim} btnType="filled" style={{ width: "100%" }}>
                                Open Claiming Page
                              </Button>
                            </Grid>
                          )
                        }
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
                          <br />
                          {/* In here the array of the information of the Diamon NFT */}
                          <RenderDetails data={nftData} />
                        </Container>,
                        <Container size="sm" padding="32px" smPadding="16px">
                          <h2 style={{ textAlign: 'center' }}>Origyn Certificate</h2>
                          <br />
                          <Certificate
                            data={{
                              Name: nftData.name,
                              'NFT Type': 'Digital Twin',
                              'Date Minted': '08/25/2022',
                              'Owner Principal ID':
                                'zevfd-yumga-hdmnw-uk7fw-qdetm-l7jk7-rbalg-mvgk4-wqh1u',
                              'Canister ID': 'jwcfb-hyaaa-aaaaj-aac4q-cai',
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
                                      <PreviewImage />
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
                                        <path d="M9.5 12.0001C9.2875 12.0001 9.1095 11.9281 8.966 11.7841C8.822 11.6406 8.75 11.4626 8.75 11.2501V5.8876L7.34375 7.29385C7.19375 7.44385 7.01875 7.51885 6.81875 7.51885C6.61875 7.51885 6.4375 7.4376 6.275 7.2751C6.125 7.1251 6.05325 6.94685 6.05975 6.74035C6.06575 6.53435 6.1375 6.3626 6.275 6.2251L8.975 3.5251C9.05 3.4501 9.13125 3.39685 9.21875 3.36535C9.30625 3.33435 9.4 3.31885 9.5 3.31885C9.6 3.31885 9.69375 3.33435 9.78125 3.36535C9.86875 3.39685 9.95 3.4501 10.025 3.5251L12.725 6.2251C12.875 6.3751 12.9467 6.5531 12.9403 6.7591C12.9342 6.9656 12.8625 7.1376 12.725 7.2751C12.575 7.4251 12.397 7.5031 12.191 7.5091C11.9845 7.5156 11.8062 7.44385 11.6562 7.29385L10.25 5.8876V11.2501C10.25 11.4626 10.1783 11.6406 10.0347 11.7841C9.89075 11.9281 9.7125 12.0001 9.5 12.0001ZM5 15.0001C4.5875 15.0001 4.2345 14.8533 3.941 14.5598C3.647 14.2658 3.5 13.9126 3.5 13.5001V12.0001C3.5 11.7876 3.57175 11.6093 3.71525 11.4653C3.85925 11.3218 4.0375 11.2501 4.25 11.2501C4.4625 11.2501 4.64075 11.3218 4.78475 11.4653C4.92825 11.6093 5 11.7876 5 12.0001V13.5001H14V12.0001C14 11.7876 14.072 11.6093 14.216 11.4653C14.3595 11.3218 14.5375 11.2501 14.75 11.2501C14.9625 11.2501 15.1405 11.3218 15.284 11.4653C15.428 11.6093 15.5 11.7876 15.5 12.0001V13.5001C15.5 13.9126 15.3533 14.2658 15.0597 14.5598C14.7657 14.8533 14.4125 15.0001 14 15.0001H5Z"/>
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
      <ConnectQRModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <SendCertificateToPrincipal isOpen={isSendOpen} onClose={() => setIsSendOpen(false)} loggedIn={loggedIn} />
    </>
  );
};

export default WalletPage;

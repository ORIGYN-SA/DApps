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
} from '@origyn-sa/origyn-art-ui';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { LoadingContainer } from '../../../../../features/components';
import { timeConverter } from '../../../../../utils';
import { ConnectQRModal } from '../../modals/ConnectQRModal';
import { TextBlocks } from '../../components/TextBlocks';
import Certificate from '../../../../luxury/src/components/Certificate';
import SquareIcon from '@mui/icons-material/Square';
import PlayForWorkIcon from '@mui/icons-material/PlayForWork';
import { CandyToJson } from '../../../../../utils/src/candyParser';
import { formTemplate } from '../Main/Tabs/Minter';
import { SendCertificateToPrincipal } from '../../modals/SendCertificateToPrincipal';

const RenderDetails = ({ data }) => {
  const FT = JSON.parse(localStorage.getItem('formTemplate')) || formTemplate;

  return <Flex flexFlow="column" gap={16}>{
    FT?.IGI?.map((item) => {
      return (
        <Flex flexFlow="column" gap={24}>
          <Flex flexFlow="column" align="center" justify="center">
            <br />
            <h4>{item.title}</h4>
            <br />
          </Flex>
          {item?.fields?.map((f) =>
            <>
              <Flex align="center" justify="space-between">
                <p>{f.label}</p>

                <p style={{ textAlign: 'end' }} className="secondary_color">
                  {data[f.name]?.toString()}
                </p>
              </Flex>
              <HR />
            </>
          )}
        </Flex>
      )
    })
  }</Flex>
}

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
  console.log('NFT Data', nftData);
  console.log('NFT Normal', normalData);

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
    console.log(responseNormalData, "responseNormalData");
    
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
      setLibraries(metadata.metadata.library);
      try {
        const toJS = new CandyToJson(metadata);
        setNftData(toJS.getAllDataFields());
      } catch (e){
        setNftData({});
      }
      setIsLoading(false);
      return data;
    }
  };

  const generateQR = async () => {
    const response = await fetch(`https://development.canister.origyn.ch/canister/v0/token`, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'x-access-token': loggedIn,
      },
      body: JSON.stringify({ amount: 1 }),
    });
    console.log(response);
    const data = await response.blob();

    const downloadUrl = URL.createObjectURL(data);
    const a = document.createElement('a');
    // safari doesn't support this yet
    if (typeof a.download === 'undefined') {
      window.location.href = downloadUrl;
    } else {
      a.href = downloadUrl;
      a.download = 'qrcode.zip';
      document.body.appendChild(a);
      a.click();
    }
    console.log(data);
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
                            <p style={{ color: '#DD1422' }}>
                              {normalData?.status}
                            </p>
                          </div>
                          {normalData.status === 'SUCCESS' && (
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
                          normalData.status === "PRE_STAGE" && (
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
                          normalData.status === "WAITING_FOR_OWNER" && (
                            <Grid columns={2} gap={16}>
                              <Button onClick={generateQR} btnType="filled" style={{ width: "100%" }}>
                                Generate QR
                              </Button>
                              <Button
                                onClick={() => setIsOpen(true)}
                                btnType="outlined"
                                disabled={normalData.status !== 'WAITING_FOR_OWNER'}
                                style={{ width: "100%" }}
                              >
                                Connect with QR
                              </Button>
                              <Button
                                onClick={() => setIsSendOpen(true)}
                                btnType="outlined"
                                disabled={normalData.status !== 'WAITING_FOR_OWNER'}
                                style={{ width: "100%" }}
                              >
                                Send to Principal
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
                          <RenderDetails
                            data={nftData}
                          />

                        </Container>,
                        <Container size="sm" padding="32px" smPadding="16px">
                          <h2 style={{ textAlign: 'center' }}>Origyn Certificate</h2>
                          <br />
                          <Certificate
                            data={{
                              Name: nftData.name,
                              "NFT Type": "Digital Twin",
                              "Date Minted": "08/25/2022",
                              "Owner Principal ID": "zevfd-yumga-hdmnw-uk7fw-qdetm-l7jk7-rbalg-mvgk4-wqh1u",
                              "Canister ID": "jwcfb-hyaaa-aaaaj-aac4q-cai",

                            }}
                          />
                        </Container>,

                        <Container size="sm" padding="32px" smPadding="16px">
                          <h2 style={{ textAlign: 'center' }}>Digital Media</h2>
                          <br />
                          <Container size="md" padding="50px">
                            <Grid columns={2} mdColumns={2} gap={120} smGap={16} mdGap={40}>
                              {libraries.map((l) => {
                                return (
                                  <img src={l?.library_file} style={{ borderRadius: "12px" }} />
                                )
                              })}
                            </Grid>
                          </Container>

                          <h2 style={{ textAlign: 'center' }}>Documents</h2>
                          <br />
                          <Container size="md" padding="50px">
                            <Grid columns={2} mdColumns={2} gap={120} smGap={16} mdGap={40}>
                              <Card padding="16px" justify="space-between">
                                <Grid columns={2} mdColumns={2} gap={120} smGap={16} mdGap={40}>
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <SquareIcon fontSize="large" />
                                    <div>
                                      <p style={{ whiteSpace: 'nowrap', marginLeft: 10 }}>
                                        IGI Report
                                      </p>
                                      <p
                                        className="secondary_color"
                                        style={{ whiteSpace: 'nowrap', marginLeft: 10 }}
                                      >
                                        IGI Report #{nftData.report_number}
                                      </p>
                                    </div>
                                  </div>
                                  <Flex justify="flex-end" align="center">
                                    <PlayForWorkIcon fontSize="large" />
                                  </Flex>
                                </Grid>
                              </Card>
                              <Card padding="16px" justify="space-between">
                                <Grid columns={2} mdColumns={2} gap={120} smGap={16} mdGap={40}>
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <SquareIcon fontSize="large" />
                                    <div>
                                      <p style={{ whiteSpace: 'nowrap', marginLeft: 10 }}>
                                        Origyn Certificate
                                      </p>
                                      <p
                                        className="secondary_color"
                                        style={{ whiteSpace: 'nowrap', marginLeft: 10 }}
                                      >
                                        Minting Date: {nftData.report_date}
                                      </p>
                                    </div>
                                  </div>
                                  <Flex justify="flex-end" align="center">
                                    <PlayForWorkIcon fontSize="large" />
                                  </Flex>
                                </Grid>
                              </Card>
                            </Grid>
                          </Container>

                          <Flex flexFlow="column" gap={16}>
                            {normalData?.statusHistory.map((hItem) => {
                              const createDate = new Date(hItem.createdAt);
                              const updateDate = new Date(hItem.updatedAt);
                              return (
                                <React.Fragment>
                                  <h2 style={{ textAlign: 'center' }}>History</h2>
                                  <br />
                                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <p className="secondary_color">Status</p>
                                    <p>{hItem.status}</p>
                                  </div>
                                  <HR marginTop={20} />
                                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <p className="secondary_color">Created at</p>
                                    <p>{timeConverter(BigInt(createDate.valueOf()) * 1000000n)}</p>
                                  </div>
                                  <HR marginTop={16} />
                                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <p className="secondary_color">Updated at</p>
                                    <p>{timeConverter(BigInt(updateDate.valueOf()) * 1000000n)}</p>
                                  </div>
                                  <HR marginTop={16} />
                                  <br />
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
      <SendCertificateToPrincipal isOpen={isSendOpen} onClose={() => setIsSendOpen(false)} />
    </>
  );
};

export default WalletPage;

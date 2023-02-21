/* eslint-disable react/jsx-key */
import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Flex,
  Grid,
  SecondaryNav,
  Container,
  Banner,
  Card,
} from '@origyn-sa/origyn-art-ui';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { LoadingContainer } from '../../../../../features/components';
import { CandyToJson } from '../../../../../utils/src/candyParser';
import { useDialog } from '@connect2ic/react';
import { AuthContext } from '@dapp/features-authentication';

const ClaimPage = () => {
  const { open } = useDialog()
  const { loggedIn, principal, handleLogOut } = useContext(AuthContext)
  const [nftData, setNftData] = useState<any>();
  const [libraries, setLibraries] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [normalData, setNormalData] = useState<any>();
  const navigate = useNavigate();

  const fetchData = async () => {
    const urlSearchParams = new URLSearchParams(window.location.href?.split('?')[1]);
    const { tokenId } = Object.fromEntries(urlSearchParams.entries());

    console.log(tokenId);
    const responseNormalData = await fetch(
      `https://development.canister.origyn.ch/canister/v0/nft-token/${tokenId}/`,
      {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
      },
    );

    const data = await responseNormalData.json();

    console.log(data, "data");
    setNormalData(data);
    const response = await fetch(
      `https://development.canister.origyn.ch/canister/v0/nft-token/${tokenId}/metadata`,
      {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
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

  const handleClaim = async () => {
    setIsLoading(true);
    const urlSearchParams = new URLSearchParams(window.location.href?.split('?')[1]);
    const { code, tokenId } = Object.fromEntries(urlSearchParams.entries());

    const responseNormalData = await fetch(
      `https://development.canister.origyn.ch/canister/v0/token/${code}/`,
      {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify({principalId: principal.toString()})
      },
    );
    setIsLoading(false);
    navigate(`/?tokenId=${tokenId}&canisterId=q7abh-kaaaa-aaaaj-qazva-cai`);
  };

  useEffect(() => {
    if (loggedIn) {
      fetchData();
    }
  }, [loggedIn]);

  return (
    <>
      {
        loggedIn ? (
          <>
            {isLoading || isMinting ? (
              <LoadingContainer />
            ) : (
              <Flex fullWidth padding="0" flexFlow="column">
                <SecondaryNav
                  title="Claim"
                  tabs={[{ title: 'Cerificate Claiming', id: 'claim' }]}
                  content={[
                    <>
                      <Flex flexFlow="column" gap={8}>
                        <Grid columns={2} mdColumns={2} smGap={16} mdGap={40}>
                          <Container size="sm" padding="48px" align="center">
                            <Flex style={{ height: '100%' }}>
                              <img style={{ borderRadius: '18px', objectFit: 'contain' }} src={libraries[0]?.library_file || libraries[0]?.source} />
                            </Flex>
                          </Container>
                          <Banner bgColor="NAVIGATION_BACKGROUND" padding="48px" style={{ height: 'calc(100vh - 80px)' }}>
                            <Flex flexFlow="column" gap={8} justify="center">
                              <h4>Congratulations , Your claim your digital certificate.</h4>
                              <br />
                              <p>Click the claim button and follow the instructions on how to claim and secure your certificate</p>
                              <br />
                              <h2>
                                <b>Certificate #{normalData?.tokenId}</b>
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
                              {normalData.status === "QR_CODE_ASSIGNED" && (
                                <Button onClick={handleClaim}>Claim Certificate</Button>
                              )}
                            </Flex>
                          </Banner>
                        </Grid>
                      </Flex>
                    </>,
                  ]}
                  onLogOut={handleLogOut}
                  principal={principal.toString()}
                />
              </Flex>
            )}
          </>
        ) : (
          <>
            <Flex  align="center" justify="center" style={{height: "100vh"}}>
              <Card padding="48px" gap={48} type="filled" flexFlow="column" align="center" justify="center">
                <h6>Connect your wallet to continue</h6>
                <Button
                  variant='contained'
                  onClick={open}
                >
                  Connect wallet
                </Button>
              </Card>
            </Flex>
          </>
        )
      }
    </>
  );
};

export default ClaimPage;

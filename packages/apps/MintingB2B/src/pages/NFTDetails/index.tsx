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
import { useParams } from 'react-router-dom';
import { LoadingContainer } from '../../../../../features/components';
import { timeConverter } from '../../../../../utils';
import { ConnectQRModal } from '../../modals/ConnectQRModal';
import diamond from './diamante.png';
import { TextBlocks } from '../../components/TextBlocks';
import Certificate from '../../../../luxury/src/components/Certificate';
import SquareIcon from '@mui/icons-material/Square';
import PlayForWorkIcon from '@mui/icons-material/PlayForWork';

const WalletPage = () => {
  const [loggedIn, setLoggedIn] = useState('');
  const [nftData, setNftData] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const { nft_id } = useParams();
  const [normalData, setNormalData] = useState();
  console.log('NFT Data', nftData);
  console.log('NFT Normal', normalData);

  const parseFunc = (data) => {
    class CandyValue {
      constructor(candy) {
        this._candy = candy;
      }

      getValue() {
        const { Text, Bool, Nat, Array, Class } = this._candy.value;
        return Text ?? Bool ?? Nat ?? Class ?? Array?.thawed;
      }

      getName() {
        return this._candy.name;
      }

      isClassOrArray() {
        const { Array, Class } = this._candy.value;
        return Array || Class || false;
      }
    }

    class CandyToJson {
      // index = the index in __ apps.value.Array.thawed where the data sits
      constructor(metadata, index = 0) {
        this._metadata = metadata.metadata.meta.metadata; // i know, right? could be improved
        this._metadataClass = metadata.metadata.meta.metadata.Class;
        this._id = this._findClass('id');
        this._appsClass = this._getClassValue('__apps')[index].Class;
        this._dataClass = this._getClassValue('data', this._appsClass);
      }

      _findClass(_name, level = this._metadataClass) {
        return level.find(({ name }) => name === _name);
      }

      _findAppsClass() {}

      _getClassValue(_name, level = this._metadataClass) {
        return new CandyValue(this._findClass(_name, level)).getValue();
      }

      getFieldValue(_name, language = 'en', level = this._dataClass) {
        const candy = new CandyValue(level.find(({ name }) => name === _name));
        if (!candy.isClassOrArray()) {
          return candy.getValue();
        }

        // TODO: We will need recursivity here for Arrays
        const dataField = new CandyValue(this._findClass('data', candy.getValue()));

        if (!dataField.isClassOrArray()) {
          return dataField.getValue();
        }

        const languageCandy = new CandyValue(this._findClass(language, dataField.getValue()));

        return languageCandy.getValue();
      }

      getAllDataFields() {
        return this._dataClass.reduce((previous, field) => {
          const { name } = field;
          const value = this.getFieldValue(name);
          return {
            ...previous,
            [name]: value,
          };
        }, {});
      }
    }

    const parser = new CandyToJson(data);

    const fields = parser.getAllDataFields();
    setNftData(fields);
  };

  const handleLogOut = () => {
    setLoggedIn('');
  };

  const fetchData = async () => {
    const response = await fetch(
      `https://development.canister.origyn.ch/canister/v0/nft-token/${nft_id}/metadata`,
      {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'x-api-key': loggedIn,
        },
      },
    );
    const responseNormalData = await fetch(
      `https://development.canister.origyn.ch/canister/v0/nft-token/${nft_id}/`,
      {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'x-api-key': loggedIn,
        },
      },
    );
    const data = await Promise.all([response.json(), responseNormalData.json()]);
    setNormalData(data[1]);
    parseFunc(data[0]);
    setIsLoading(false);
    return data;
  };

  const generateQR = async () => {
    const response = await fetch(`https://development.canister.origyn.ch/canister/v0/token`, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'x-api-key': loggedIn,
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

  useEffect(() => {
    setLoggedIn(localStorage.getItem('apiKey'));
    fetchData();
  }, []);

  return (
    <>
      {isLoading ? (
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
                      <img style={{ borderRadius: '18px', width: '100%' }} src={diamond} />
                      <Flex flexFlow="column" gap={8} justify="center">
                        <p className="secondary_color">Token ID</p>
                        <h2>
                          <b>{normalData?.tokenId}</b>
                        </h2>
                        <Flex align="center" justify="space-between">
                          <div>
                            <p className="secondary_color">Status</p>
                            <p style={{ color: '#DD1422' }}>
                              {normalData?.status == 'WAITING_FOR_OWNER' ? 'Waiting for Owner' : ''}
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
                        <Flex align="center" justify="space-around">
                          <Button onClick={generateQR} btnType="filled" size="large">
                            Generate QR
                          </Button>
                          <Button
                            onClick={() => setIsOpen(true)}
                            btnType="filled"
                            disabled={normalData.status !== 'WAITING_FOR_OWNER'}
                            size="large"
                          >
                            Connect with QR
                          </Button>
                        </Flex>
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
                          {['Diamond'].map((e, i) => (
                            <React.Fragment key={i}>
                              <TextBlocks data={nftData} title={e} />
                              <br />
                            </React.Fragment>
                          ))}
                        </Container>,
                        <Container size="sm" padding="32px" smPadding="16px">
                          <h2 style={{ textAlign: 'center' }}>Origyn Certificate</h2>
                          <br />
                          <Certificate
                            owner={normalData?._id.toString()}
                            brand={nftData.name}
                            model={nftData.name}
                            refNumber={normalData?._id}
                            serialNumber={`${normalData?._id} ['Serial Number']`}
                            canister={normalData?._id}
                          />
                        </Container>,

                        <Container size="sm" padding="32px" smPadding="16px">
                          <h2 style={{ textAlign: 'center' }}>Digital Media</h2>
                          <br />
                          <Container size="md" padding="50px">
                            <Grid columns={2} mdColumns={2} gap={120} smGap={16} mdGap={40}>
                              <img style={{ borderRadius: '18px', width: '100%' }} src={diamond} />
                              <img style={{ borderRadius: '18px', width: '100%' }} src={diamond} />
                              <img style={{ borderRadius: '18px', width: '100%' }} src={diamond} />
                              <img style={{ borderRadius: '18px', width: '100%' }} src={diamond} />
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
    </>
  );
};

export default WalletPage;

import { CssBaseline, Grid } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@dapp/features-authentication';
import styled from 'styled-components';
import Header from '../../components/Header';
import ArrowIcon from '../../components/ArrowIcon';
import BoxIcon from '../../components/BoxIcon';
import WarrantyIcon from '../../components/WarrantyIcon';
import InvoiceIcon from '../../components/InvoiceIcon';
import DocumentIcon from '../../components/DocumentIcon';
import DownloadIcon from '../../components/DownloadIcon';
import Certificate from '../../components/Certificate';

const ContentContainer = styled.div`
  font-family: Outfit;
  background-image: url(${({ imageURL }) => imageURL});
  min-height: 100%;
  min-width: 100%;
`;

const FlexBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Accordion = styled.div`
  width: 100%;
  height: 70px;
  font-weight: 600;
  font-size: 16px;
  line-height: 18px;

  padding: 20px;
  background: #f7f7f7;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AccordionSection = styled.div`
  width: 100%;
  padding: 13px 20px;
  color: #afafaf;

  & > div {
    margin: 5px 0;
  }

  p {
    margin: 0;
  }

  h3 {
    color: #363636;
    font-weight: 600;
    font-size: 16px;
    line-height: 18px;
    margin: 12px 0;
  }
`;

const History = styled.div`
  margin-left: 20px;
  padding-left: 22px;
  border-left: 1px solid #afafaf;

  h3 {
    position: relative;

    &:before {
      content: '';
      display: block;
      position: absolute;

      width: 24px;
      height: 24px;
      background: #f7f7f7;
      border-radius: 50%;
      left: -35px;
      top: -3px;
    }
    &:after {
      content: '';
      display: block;
      position: absolute;

      width: 13px;
      height: 13px;
      background: #363636;
      border-radius: 50%;
      left: -29.5px;
      top: 2.5px;
    }
  }
`;

const NFTPage = () => {
  const { tokenId, canisterId, actor } = useContext(AuthContext);
  const [specifications, setSpecifications] = useState(true);
  const [history, setHistory] = useState(true);
  const [documents, setDocuments] = useState(true);
  const [description, setDescription] = useState(true);

  const [metadata, setMetadata] = useState<any>({});
  const [owner, setOwner] = useState<any>();
  const [documentsList, setDocumentsList] = useState<any>([]);
  const [images, setImages] = useState<any>([]);

  useEffect(() => {
    console.log(actor);
    actor?.nft_origyn(tokenId).then((data) => {
      const meta = data?.ok?.metadata.Class;
      const apps = meta?.find((data) => data.name === '__apps');
      const publicApp = apps.value.Array.thawed.find(
        (item) => item.Class.find(({ name }) => name === 'app_id').value.Text === 'public.metadata',
      );
      const publicData = publicApp.Class.find((data) => data.name === 'data');

      const d = publicData.value.Class.reduce((data, current) => {
        return {
          ...data,
          [current.name]: current.value.hasOwnProperty('Text') ? current.value.Text : current.value,
        };
      }, {});
      const attachments = meta
        ?.find((data) => data.name === 'library')
        .value.Array.thawed.filter((item) =>
          item.Class.find(({ name }) => name === 'library_id').value.Text.includes('document'),
        );

      const mintedMedia = meta
        ?.find((data) => data.name === 'library')
        .value.Array.thawed.filter((item) =>
          item.Class.find(({ name }) => name === 'library_id').value.Text.includes('minted'),
        );

      console.log(publicData, d, mintedMedia, attachments, meta);

      setMetadata(d);
      setOwner(meta?.find((data) => data.name === 'owner').value.Principal.toString());
      setImages(mintedMedia);
      setDocumentsList(attachments);

      const history = actor.history_nft_origyn(tokenId, [100n], [0n]).then(console.log);
      console.log(history);
    });
  }, [actor, tokenId]);

  return (
    <ContentContainer imageURL="123">
      <CssBaseline />
      <Header />
      <Grid container style={{ padding: 20 }} spacing={4}>
        <Grid item xs={12} md={6}>
          <br />
          <FlexBlock style={{ justifyContent: 'center' }}>
            <h1>{metadata.Brand}</h1>
          </FlexBlock>
          <FlexBlock style={{ justifyContent: 'center' }}>
            <img src={images[0]?.Class.find(({ name }) => name === 'location').value.Text} alt="" />
          </FlexBlock>
          <FlexBlock style={{ textAlign: 'center', justifyContent: 'center' }}>
            <h2>
              {metadata?.Brand} <br />
              {metadata?.Model}
            </h2>
          </FlexBlock>
          {metadata?.Description && (
            <>
              <Accordion onClick={() => setDescription(!description)}>
                <span>DESCRIPTION</span>
                <ArrowIcon />
              </Accordion>
              {description && (
                <>
                  <AccordionSection>
                    <Grid container alignItems="center">
                      <Grid item xs={6} md={3}>
                        <FlexBlock style={{ justifyContent: 'flex-start', gap: 10 }}>
                          <BoxIcon />
                          <span>Box</span>
                        </FlexBlock>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <FlexBlock style={{ justifyContent: 'flex-start', gap: 10 }}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="25"
                            height="25"
                            viewBox="0 0 25 25"
                            fill="none"
                          >
                            <path
                              d="M11.3257 8.45312C11.3397 8.36177 11.3757 8.27514 11.4305 8.20066L11.4307 8.2005C11.4709 8.14567 11.5555 8.05168 11.7367 7.97182C11.92 7.89101 12.2087 7.82194 12.6602 7.82967L12.6603 7.82967C13.17 7.83801 13.5335 8.04763 13.7251 8.28491L13.725 8.28493L13.7269 8.28709C13.819 8.39697 13.8787 8.53041 13.8991 8.67237C13.9195 8.81433 13.8998 8.95917 13.8424 9.09056L13.8423 9.09053L13.8405 9.0949C13.7497 9.32156 13.5542 9.44905 13.0023 9.69244L13.0015 9.69276L12.964 9.70956L12.9635 9.70976L12.947 9.71707C12.7293 9.81357 12.406 9.95683 12.1451 10.1656L12.1448 10.1658C11.8065 10.4377 11.5258 10.8517 11.5258 11.4297V12.1797V12.1798C11.5259 12.4185 11.6209 12.6473 11.7898 12.816C11.9587 12.9847 12.1877 13.0793 12.4264 13.0792C12.6651 13.079 12.8939 12.9841 13.0626 12.8152C13.2313 12.6463 13.3259 12.4173 13.3258 12.1786M11.3257 8.45312L10.4257 9.32969C10.212 9.32968 10.0417 9.27573 9.90891 9.1871C9.77708 9.0991 9.69108 8.98285 9.63533 8.8712C9.57987 8.76013 9.55289 8.65088 9.53954 8.57066C9.5328 8.5302 9.52938 8.49615 9.52763 8.47163C9.52675 8.45935 9.52629 8.44938 9.52605 8.44211L9.52582 8.43326L9.52579 8.43042L9.52578 8.42941L9.52578 8.42902L9.52578 8.42884C9.52578 8.42876 9.52578 8.42869 9.67578 8.42869H9.52578V8.41969V8.41792H9.52579C9.52637 8.36837 9.52933 8.31887 9.53465 8.2696L9.53475 8.26862C9.58198 7.85626 9.73658 7.4635 9.98311 7.12959L9.98324 7.12941C10.4719 6.46962 11.3386 6.00605 12.6914 6.02971L12.6915 6.02971C13.6812 6.04742 14.5679 6.46248 15.1266 7.15555L15.1266 7.15562C15.6959 7.86271 15.8882 8.82261 15.5111 9.7644C15.1253 10.7287 14.2545 11.1096 13.7849 11.3149L13.7812 11.3165M11.3257 8.45312C11.3196 8.68738 11.2224 8.91005 11.0546 9.07377C10.8865 9.23789 10.6608 9.32974 10.4258 9.32969L11.3257 8.45312ZM13.3258 12.1786V12.1787H13.1758L13.3258 12.1786ZM13.3258 12.1786V11.533M13.3258 11.533C13.3962 11.4906 13.513 11.4354 13.7301 11.34L13.7301 11.34L13.7325 11.339L13.7812 11.3165M13.3258 11.533C13.3032 11.5466 13.2853 11.5589 13.2705 11.5708L13.1848 11.4637M13.3258 11.533V11.4547H13.1778L13.1768 11.4537L13.1848 11.4637M13.7812 11.3165L13.7825 11.316L13.7198 11.1797M13.7812 11.3165L13.7799 11.3171L13.7198 11.1797M13.7198 11.1797C14.1908 10.9737 15.0098 10.6137 15.3718 9.70869L13.7198 11.1797ZM13.1848 11.4637L13.1758 11.4547M13.1848 11.4637L13.1758 11.4547M13.1758 11.4547H13.1776H13.1758ZM12.4258 16.0797C12.7308 16.0797 13.0233 15.9585 13.239 15.7429C13.4546 15.5272 13.5758 15.2347 13.5758 14.9297C13.5758 14.6247 13.4546 14.3322 13.239 14.1165C13.0233 13.9008 12.7308 13.7797 12.4258 13.7797C12.1208 13.7797 11.8283 13.9008 11.6126 14.1165C11.3969 14.3322 11.2758 14.6247 11.2758 14.9297C11.2758 15.2347 11.3969 15.5272 11.6126 15.7429C11.8283 15.9585 12.1208 16.0797 12.4258 16.0797ZM4.80195 3.05585C4.30498 3.55283 4.02578 4.22686 4.02578 4.92969V19.9297C4.02578 20.6325 4.30498 21.3065 4.80195 21.8035C5.29892 22.3005 5.97296 22.5797 6.67578 22.5797H19.9258C20.1645 22.5797 20.3934 22.4849 20.5622 22.3161C20.731 22.1473 20.8258 21.9184 20.8258 21.6797C20.8258 21.441 20.731 21.2121 20.5622 21.0433C20.3934 20.8745 20.1645 20.7797 19.9258 20.7797H6.67578C6.45035 20.7797 6.23415 20.6901 6.07474 20.5307C5.95115 20.4071 5.86954 20.2494 5.83912 20.0797H19.9258C20.1645 20.0797 20.3934 19.9849 20.5622 19.8161C20.731 19.6473 20.8258 19.4184 20.8258 19.1797V4.92969C20.8258 4.58168 20.7572 4.23709 20.6241 3.91558C20.4909 3.59406 20.2957 3.30193 20.0496 3.05585C19.8035 2.80978 19.5114 2.61458 19.1899 2.48141C18.8684 2.34823 18.5238 2.27969 18.1758 2.27969H6.67578C5.97296 2.27969 5.29892 2.55888 4.80195 3.05585ZM19.0258 4.92969V18.2797H5.82578V4.92969C5.82578 4.70425 5.91533 4.48805 6.07474 4.32865C6.23415 4.16924 6.45035 4.07969 6.67578 4.07969H18.1758C18.4012 4.07969 18.6174 4.16924 18.7768 4.32865C18.9362 4.48805 19.0258 4.70425 19.0258 4.92969Z"
                              fill="#A9A9A9"
                              stroke="#A9A9A9"
                              strokeWidth="0.3"
                            />
                          </svg>
                          <span>User Manual</span>
                        </FlexBlock>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <FlexBlock style={{ justifyContent: 'flex-start', gap: 10 }}>
                          <WarrantyIcon />
                          <span>Warranty</span>
                        </FlexBlock>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <FlexBlock style={{ justifyContent: 'flex-start', gap: 10 }}>
                          <InvoiceIcon />
                          <span>Invoice</span>
                        </FlexBlock>
                      </Grid>
                    </Grid>
                    <br />
                    <p>{metadata?.Description}</p>
                  </AccordionSection>
                  <hr />
                  <AccordionSection>
                    <h3>Owner information</h3>
                    <Grid container>
                      <Grid item xs={3}>
                        Principal ID
                      </Grid>
                      <Grid item xs={9}>
                        <b>{owner}</b>
                      </Grid>
                    </Grid>
                    <Grid container>
                      <Grid item xs={3}>
                        Alias
                      </Grid>
                      <Grid item xs={9}>
                        <b>AlinCX</b>
                      </Grid>
                    </Grid>
                  </AccordionSection>
                </>
              )}
            </>
          )}
          <Accordion>
            <span>GALLERY</span>
            <ArrowIcon />
          </Accordion>
          <AccordionSection>
            <Grid container>
              {images.map((img) => {
                return (
                  <Grid
                    item
                    xs={12}
                    md={4}
                    key={img?.Class.find(({ name }) => name === 'location').value.Text}
                  >
                    <img
                      style={{ maxWidth: '100%' }}
                      src={img?.Class.find(({ name }) => name === 'location').value.Text}
                      alt=""
                    />
                  </Grid>
                );
              })}
            </Grid>
          </AccordionSection>
        </Grid>
        <Grid item xs={12} md={6}>
          <Accordion onClick={() => setSpecifications(!specifications)}>
            <span>SPECIFICATION</span>
            <ArrowIcon />
          </Accordion>
          {specifications && (
            <>
              <AccordionSection>
                <h3>Watch Details</h3>
                <Grid container>
                  <Grid item xs={3}>
                    Name
                  </Grid>
                  <Grid item xs={9}>
                    <b>
                      {metadata?.Brand} {metadata?.Model}
                    </b>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={3}>
                    Year
                  </Grid>
                  <Grid item xs={9}>
                    <b>{metadata?.Year}</b>
                  </Grid>
                </Grid>
                {/*<Grid container>*/}
                {/*  <Grid item xs={3}>Limited</Grid>*/}
                {/*  <Grid item xs={9}><b>No</b></Grid>*/}
                {/*</Grid>*/}
                {/*<Grid container>*/}
                {/*  <Grid item xs={3}>Box & Papers</Grid>*/}
                {/*  <Grid item xs={9}><b>Yes</b></Grid>*/}
                {/*</Grid>*/}
              </AccordionSection>
              <hr />
              <AccordionSection>
                <h3>Case</h3>
                <Grid container>
                  <Grid item xs={3}>
                    Materials
                  </Grid>
                  <Grid item xs={9}>
                    <b>{metadata?.Materials}</b>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={3}>
                    Glass
                  </Grid>
                  <Grid item xs={9}>
                    <b>{metadata?.Glass}</b>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={3}>
                    Back
                  </Grid>
                  <Grid item xs={9}>
                    <b>{metadata?.Back}</b>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={3}>
                    Shape
                  </Grid>
                  <Grid item xs={9}>
                    <b>{metadata?.Shape}</b>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={3}>
                    Diameter
                  </Grid>
                  <Grid item xs={9}>
                    <b>{metadata?.Diameter}</b>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={3}>
                    Height
                  </Grid>
                  <Grid item xs={9}>
                    <b>{metadata?.Height}</b>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={3}>
                    W/R
                  </Grid>
                  <Grid item xs={9}>
                    <b>{metadata['Water Resistance']}</b>
                  </Grid>
                </Grid>
              </AccordionSection>
              <hr />
              <AccordionSection>
                <h3>Dial</h3>
                <Grid container>
                  <Grid item xs={3}>
                    Nickname
                  </Grid>
                  <Grid item xs={9}>
                    <b>{metadata?.Nickname}</b>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={3}>
                    Color
                  </Grid>
                  <Grid item xs={9}>
                    <b>{metadata?.Color}</b>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={3}>
                    Finish
                  </Grid>
                  <Grid item xs={9}>
                    <b>{metadata?.Finish}</b>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={3}>
                    Indexes
                  </Grid>
                  <Grid item xs={9}>
                    <b>{metadata['Index Type']}</b>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={3}>
                    Hands
                  </Grid>
                  <Grid item xs={9}>
                    <b>{metadata?.Hands}</b>
                  </Grid>
                </Grid>
              </AccordionSection>
              <br />
            </>
          )}
          <Accordion onClick={() => setHistory(!history)}>
            <span>HISTORY</span>
            <ArrowIcon />
          </Accordion>
          {history && (
            <AccordionSection>
              <History>
                <h3>01/02/2022</h3>
                <p>
                  <b>Biometry Capture</b>
                </p>
                <p>Organisation name</p>
                <hr />
                <h3>22/12/2021</h3>
                <p>
                  <b>Watch Service</b>
                </p>
                <p>Organisation name</p>
                <hr />
                <h3>22/10/2020</h3>
                <p>
                  <b>NFT Creation</b>
                </p>
                <p>Organisation name</p>
              </History>
            </AccordionSection>
          )}
          <Accordion onClick={() => setDocuments(!documents)}>
            <span>DOCUMENTS</span>
            <ArrowIcon />
          </Accordion>
          {documents && (
            <AccordionSection>
              {documentsList.map((doc) => (
                <>
                  <FlexBlock>
                    <FlexBlock style={{ gap: 14 }}>
                      <DocumentIcon />
                      <div>
                        <p>
                          <b>
                            <span style={{ color: '#363636' }}>
                              {
                                doc.Class.find(({ name }) => name === 'filename').value.Text.split(
                                  '.',
                                )[0]
                              }
                            </span>
                            .
                            {
                              doc.Class.find(({ name }) => name === 'filename').value.Text.split(
                                '.',
                              )[1]
                            }
                          </b>
                        </p>
                        <p style={{ fontSize: 14 }}>
                          {new Date(
                            doc.Class.find(({ name }) => name === 'created_at')?.value?.Text,
                          )?.toUTCString()}
                        </p>
                      </div>
                    </FlexBlock>
                    <a href={doc.Class.find(({ name }) => name === 'location').value.Text}>
                      <DownloadIcon />
                    </a>
                  </FlexBlock>
                </>
              ))}
            </AccordionSection>
          )}
          <Accordion>
            <span>CERTIFICATE OF AUTHENTICITY</span>
            <ArrowIcon />
          </Accordion>
          <AccordionSection>
            <Certificate
              owner={owner?.toString()}
              brand={metadata.Brand}
              model={metadata.Model}
              refNumber={metadata.refNumber}
              serialNumber={metadata['Serial Number']}
              canister={canisterId}
            />
          </AccordionSection>
        </Grid>
      </Grid>
    </ContentContainer>
  );
};

export default NFTPage;

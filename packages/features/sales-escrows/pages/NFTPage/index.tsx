import { AuthContext, useRoute, useSessionContext } from '@dapp/features-authentication';
import { NatPrice } from '@dapp/features-components';
import { ConfirmSalesActionModal } from '../../modals/ConfirmSalesActionModal';
import { StartAuctionModal } from '../../modals/StartAuctionModal';
import { StartEscrowModal } from '../../modals/StartEscrowModal';
import { eToNumber, timeConverter, isLocal } from '@dapp/utils';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import PendingIcon from '@mui/icons-material/Pending';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Container,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import React, { useContext, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { ICPIcon, OGYIcon, QuestionIcon } from '@dapp/common-assets';

const MainBox = styled.div`
  width:100%;
  height:auto;
  padding-top: 80px;
  padding-left: 24px;
  border-radius: 16px 0px 0px 0px;
`;
const TopContainer = styled.div`
width:100%;
`;
const TopBox1 = styled.div`
  width: 50%;
  position:relative;
  float:left;
  text-align:center;
`;
const TopBox2 = styled.div`
width: 50%;
position:relative;
float:left;
`;

const LeftContainer = styled.div`
width: 525px;
padding:16px;
`;

const DetailsContainer = styled.div`
height: 80px;
padding:24px 0px 24px 0px;
/* Primary/800: border (dark) */
border-width: 1px 0px;
border-style: solid;
border-color: #242424;
margin-top:32px;
margin-bottom:32px;
`;
const IconsDetailsContainer = styled.div`
width:49%;
height:32px;
position:relative;
float:left;
padding:0px 16px 0px 16px;

`;
const VerticalSeparator = styled.div`
width:1px;
height:32px;
position:relative;
float:left;
background-color: #242424;
`;

const AuctionBTN = styled.button`
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
padding: 17px 24px;
width: 493px;
height: 56px;
color: ${(props) => props.theme.colors.PURE_BLACK};
background: #70237D;
border-radius: 999px;
border: none;
`;

const AuctionBTNtext = styled.span`
  font-family: ${(props) => props.theme.font.FONT_FAMILY_1};
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 22px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: -0.15px;
  color: ${(props) => props.theme.colors.WHITE};
`;

const NftName = styled.span`
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 500;
  font-size: 32px;
  line-height: 40px;
  letter-spacing: -1px;
  color: #fefefe;
`;

const BottomBox = styled.div`
  background: rgba(0, 0, 0, 0.3);
  heigth: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px;
`;

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
export const NFTPage = () => {
  const { principal, actor } = useContext(AuthContext);
  const { localDevelopment } = useSessionContext();
  const [currentNFT, setCurrentNFT] = useState<any>({});
  const [canisterId, setCanisterId] = useState('');
  const [openAuction, setOpenAuction] = React.useState(false);
  const [dialogAction, setDialogAction] = useState<any>();
  const [openConfirmation, setOpenConfirmation] = React.useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [openEscrowModal, setOpenEscrowModal] = React.useState(false);
  const [modalInitialValues, setModalInitialValues] = React.useState({});
  const [expanded, setExpanded] = React.useState<string | false>('panel1');

  const handleClickOpen = (item, modal = 'auction') => {
    if (modal === 'auction') setOpenAuction(true);
    else if (modal === 'confirmEnd') {
      setOpenConfirmation(true);
      setDialogAction('endSale');
    }
  };

  const handleClose = async () => {
    setOpenAuction(false);
    setOpenConfirmation(false);
  };

  const handleChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false);
  };
  const params = useParams();
  const currentOpenAuction = currentNFT?.current_sale?.find((sale) =>
    sale?.sale_type?.auction?.status?.hasOwnProperty('open'),
  );

  const handleOpen = (type) => {
    const modalInitial = {
      nftId: params.nft_id,
      sellerId: currentNFT?.metadata?.Class?.find(
        ({ name }) => name === 'owner',
      ).value.Principal.toText(),
      priceOffer: '0',
    };
    if (type === 'buyNow') {
      modalInitial.priceOffer = eToNumber(
        parseInt(currentOpenAuction?.sale_type?.auction?.config?.auction?.buy_now[0].toString()) /
          100_000_000,
      );
    } else if (type === 'bid') {
      const startPrice = parseInt(
        currentOpenAuction?.sale_type?.auction?.config?.auction?.start_price,
      );
      const min_increase = parseInt(
        currentOpenAuction?.sale_type?.auction?.config?.auction?.min_increase?.amount,
      );
      const highest_bid = parseInt(currentOpenAuction?.sale_type?.auction?.current_bid_amount);
      modalInitial.priceOffer = eToNumber(
        highest_bid > 0
          ? (parseInt(highest_bid.toString()) + parseInt(min_increase.toString())) / 100_000_000
          : parseInt(startPrice.toString()) / 100_000_000,
      );
    }
    setModalInitialValues(modalInitial);
    setOpenEscrowModal(true);
  };

  const handleCloseEscrow = async (dataChanged = false) => {
    setOpenEscrowModal(false);
    if (dataChanged) {
      // fetchData();
    }
  };

  useEffect(() => {
    if (searchParams.get('nftId')) {
      const initialParameters = searchParams.entries();
      const params = {};
      for (const [key, value] of initialParameters) {
        params[key] = value;
      }
      setModalInitialValues(params);
      setOpenEscrowModal(true);
    }

    if (actor) {
      actor
        .nft_origyn(params.nft_id)
        .then((r) => {
          console.log(r);
          setIsLoading(false);
          setCurrentNFT(r.ok);
          setNftName(
            r.ok.metadata.Class.find(
              ({ name }) => name === '__apps',
            ).value.Array.thawed[0].Class.find(({ name }) => name === 'data').value.Class[0].value
              .Text,
          );
          setnftCol(
            r.ok.metadata.Class.find(
              ({ name }) => name === '__apps',
            ).value.Array.thawed[0].Class.find(({ name }) => name === 'data').value.Class[2].value
              .Text,
          );

        })
        .catch(console.log);
    }
  }, [actor]);

  useEffect(() => {
    useRoute().then(({ canisterId }) => {
      setCanisterId(canisterId);
    });
  }, []);

  const [nftName, setNftName] = useState();
  const [nftCol, setnftCol] = useState();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }
  return (
    <>
    <MainBox>
      <TopContainer>
        <TopBox1>
          <img
            width="465px"
            style={{ borderRadius: '12px' }}
            src={`https://${canisterId}.raw.ic0.app/-/${params.nft_id}/preview`}
          />
        </TopBox1>
        <TopBox2>
          <LeftContainer>
          <div style={{display:'flex', justifyContent:'space-between', flexDirection:'column', height:'360px'}}>
          <div style={{display:'flex', flexDirection:'column'}}>
          <span>{nftCol}</span>
          
          <NftName>{nftName}</NftName>
          <span style={{marginTop:'20px'}}>
          {currentNFT?.metadata?.Class?.find(
          ({ name }) => name === '__apps',
        )?.value?.Array?.thawed[0]?.Class?.find(({ name }) => name === 'data')?.value?.Class?.find(({ name }) => name === 'description')?.value?.Text || (
            <b>No description provided</b>
          )}
          </span>
          </div>
          <DetailsContainer>
            <IconsDetailsContainer>
              <div style={{position:'relative', float:'left'}}>
              <OGYIcon/>             
               </div>

              <div>
                <span style={{position:'relative', float:'left'}}>
                  OGY
                </span>
              </div>
            </IconsDetailsContainer>
            <VerticalSeparator></VerticalSeparator>
            <IconsDetailsContainer>

            </IconsDetailsContainer>
          </DetailsContainer>
          <div>
          <AuctionBTN onClick={handleClickOpen}><AuctionBTNtext>Start an Auction</AuctionBTNtext></AuctionBTN>
          </div>
          </div>
          </LeftContainer>
        </TopBox2>
        </TopContainer>
    </MainBox>

    <BottomBox>
        Properties
        <br />
        <br/>
        <Typography>
          {currentNFT?.metadata?.Class?.find(({ name }) => name === '__apps')
            ?.value?.Array?.thawed[0].Class.find(({ name }) => name === 'data')
            .value.Class.map(({ name, value, index }) => (
              <div key={`${name}+${index}`}>
                <br/>
                <span style={{fontSize: '24px', fontFamily: 'Montserrat'}}>{name}: <b>{Object.values(value)[0].toString()}</b></span>
              </div>
            )) || <b>No properties available</b>}
        </Typography>
        <br />
        <br />
        <br />
        <br />
      </BottomBox>
   
<StartAuctionModal
open={openAuction}
handleClose={handleClose}
currentToken={currentNFT?.metadata}
/>
</>
  );
};

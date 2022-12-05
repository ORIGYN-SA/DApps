import { Box, FormControl, Tooltip, Typography, Select, MenuItem, InputLabel } from '@mui/material';
import Link from '@mui/material/Link';
import React, { useContext, useEffect, useState } from 'react';
import { TabPanel, TokenIcon, Table, NatPrice, LoadingContainer } from '@dapp/features-components';
import { AuthContext } from '@dapp/features-authentication';
import { timeConverter } from '@dapp/utils';
import { ConfirmSalesActionModal, StartAuctionModal } from '@dapp/features-sales-escrows';
import Grid from '@mui/material/Grid';
import { Card, CardContent } from '@mui/material';
import { nft } from '@dapp/features-sales-escrows/modals/tests/data';
import { useTokensContext } from '@dapp/features-tokens-provider';
import { WalletTokens } from '@dapp/features-components';
import { Button } from '@origyn-sa/origyn-art-ui';
import styled from 'styled-components';
import Theme from '../../../../../features/theme/src/styles/Theme';
import Dialog from '@mui/material/Dialog';
import Modal from '@origyn-sa/origyn-art-ui';
import { ConnectButton } from '@connect2ic/react';
import { useAuthContext, useSessionContext } from '@dapp/features-authentication';

const VaultBox = styled.div`
  height: 136px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px;
  border-bottom: 1px solid ${(props) => props.theme.colors.BLACK_DARK};
  border-radius: 16px 0px 0px 0px;
  background: ${(props) => props.theme.colors.BLACK};
`;

const VaultBoxTitle = styled.span`
  font-family: ${(props) => props.theme.font.FONT_FAMILY_1};
  font-style: normal;
  font-weight: 600;
  font-size: 32px;
  line-height: 40px;
  letter-spacing: -0.75px;
  color: ${(props) => props.theme.colors.BG_TEXT};
  mix-blend-mode: normal;
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 48px 0px 48px 24px;
  gap: 10px;
`;
const GridMain = styled.div`
  display: flex;
  flex-direction: row;
  border-top: 1px solid ${(props) => props.theme.colors.BLACK_DARK};
  padding-top: 24px;
  padding-left: 24px;
  padding-right: 24px;
  background: ${(props) => props.theme.colors.BLACK};
`;

const GridMain1 = styled.div`
  padding-right: 24px;
`;

const GridMain2 = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const GridMain2TitleBox = styled.div`
  width: 50%;
  height: auto;
  position: relative;
  float: left;
  text-align: left; ;
`;

const GridMain2Top = styled.div`
  width: 100%;
  height: 56px;
  border-bottom: 1px solid ${(props) => props.theme.colors.BLACK_DARK};
`;

const GridMain2Icon = styled.div`
  width: 50%;
  height: auto;
  position: relative;
  float: left;
  text-align: right;
`;

const GridMain2Title = styled.span`
  font-family: ${(props) => props.theme.font.FONT_FAMILY_1};
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  letter-spacing: -0.25px;
  color: ${(props) => props.theme.colors.BG_TEXT};
  padding-bottom: 24px;
`;

const WalletBalancesCSS = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 24px;
  gap: 16px;
  width: 307px;
  height: 632px;
  left: 0px;
  top: 0px;
  background: ${(props) => props.theme.colors.PURE_BLACK};
  border: 1px solid ${(props) => props.theme.colors.BLACK_DARK};
  border-radius: 12px;
`;

const UnWalletBalancesCSS = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 24px;
  gap: 16px;
  width: 307px;
  height: 160px;
  left: 0px;
  top: 0px;
  background: ${(props) => props.theme.colors.PURE_BLACK};
  border: 1px solid ${(props) => props.theme.colors.BLACK_DARK};
  border-radius: 12px;
`;
const RecentActivityCSS = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 24px;
  gap: 16px;
  width: 307px;
  height: 520px;
  left: 0px;
  top: 0px;
  background: ${(props) => props.theme.colors.PURE_BLACK};
  border: 2px solid ${(props) => props.theme.colors.BLACK_DARK};
  border-radius: 12px;
`;

const RecentActivityCSSText = styled.span`
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

const TKButtonText0 = styled.span`
  font-family: ${(props) => props.theme.font.FONT_FAMILY_1};
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 22px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: -0.15px;
  color: ${(props) => props.theme.colors.BLACK};
`;

const MTButtonText0 = styled.span`
  font-family: ${(props) => props.theme.font.FONT_FAMILY_1};
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 22px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: -0.15px;
  color: ${(props) => props.theme.colors.BG_TEXT};
`;

const TKButtonText1 = styled.span`
  font-family: ${(props) => props.theme.font.FONT_FAMILY_1};
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 22px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: -0.15px;
  color: ${(props) => props.theme.colors.BLACK};
`;

const WBText1 = styled.span`
  font-family: ${(props) => props.theme.font.FONT_FAMILY_1};
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: -0.2px;
  color: ${(props) => props.theme.colors.BG_TEXT};
`;

const WBText2 = styled.span`
  font-family: ${(props) => props.theme.font.FONT_FAMILY_1};
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 22px;
  text-align: right;
  letter-spacing: -0.15px;
  color: ${(props) => props.theme.colors.BG_TEXT};
`;

const WBText3 = styled.span`
  font-family: ${(props) => props.theme.font.FONT_FAMILY_1};
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  text-align: right;
  letter-spacing: -0.15px;
  color: ${(props) => props.theme.colors.GRAY};
`;

const TokensCSS = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  gap: 10px;
  width: 259px;
  height: 68px;
  border: 1px solid ${(props) => props.theme.colors.BLACK_DARK};
  border-radius: 12px;
  margin-top: 16px;
`;

const TKButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 17px 24px;
  width: 259px;
  height: 56px;
  color: ${(props) => props.theme.colors.PURE_BLACK};
  background: ${(props) => props.theme.colors.LIGHTER_GRAY};
  border-radius: 999px;
`;

const MTButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 17px 24px;
  width: 259px;
  height: 56px;
  color: ${(props) => props.theme.colors.WHITE};
  background: ${(props) => props.theme.colors.PURE_BLACK};
  border: 1px solid rgb(92, 90, 90);
  border-radius: 999px;
`;

const WBupdate = styled.span`
  font-family: ${(props) => props.theme.font.FONT_FAMILY_1};
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 16px;
  letter-spacing: -0.1px;
  color: #${(props) => props.theme.colors.DARK_GRAY};
`;

const ModalTextBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 24px;
`;

const ModalText = styled.span`
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 600;
  font-size: 28px;
  line-height: 36px;
  display: flex;
  align-items: center;
  letter-spacing: -0.5px;
  color: #fefefe;
  mix-blend-mode: normal;
`;

const EscrowItem = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 12px 16px;
  gap: 101px;
  width: 490px;
  height: 68px;
  border: 1px solid #242424;
  border-radius: 12px;
`;

const WithdrawButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 9px 16px 9px 20px;
  background: #f2f2f2;
  border-radius: 999px;
  width: 141px;
  height: 40px;
`;

const GridMain2Tabs = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 13px 0px 0px;
  gap: 24px;
  width: 219px;
  height: 48px;
  left: 327px;
  top: 72px;
  color: ${(props) => props.theme.colors.WHITE};
  border-bottom: 1px solid ${(props) => props.theme.colors.BLACK_DARK};
`;

const RecentActivityText = styled.span`
  font-family: ${(props) => props.theme.font.FONT_FAMILY_1};
  color: ${(props) => props.theme.colors.WHITE};
  marginright: '5px';
  marginbottom: '-3px';
  border: '2px solid ${(props) => props.theme.colors.GRAY}';
  borderradius: '12px';
  padding: '10px';
`;

const GridMain2NFTS = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const MainBox = styled.div`
  flex-direction: row;
  align-items: flex-start;
  padding: 48px 24px;
  gap: 24px;
  width: 100%;
  height: 190px;  
  background: ${(props) => props.theme.colors.BLACK};
`;

//width: 240px for MainBox

const MainBoxTitle = styled.span`
  font-family: ${(props) => props.theme.font.FONT_FAMILY_1};
  font-style: normal;
  font-weight: 600;
  font-size: 32px;
  line-height: 40px;
  letter-spacing: -0.75px;
  color: ${(props) => props.theme.colors.BG_TEXT};
  mix-blend-mode: normal;
  flex: none;
  align-self: stretch;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

const MainImage = styled.img`
  position: relative;
  float: left;
  margin-right: 16px;
  width: 96px;
  height: 96px;
  border-radius: 12px;
  background-size: cover;
  background-attachment: scroll;
  background-position: center-center;
`;

const MainSection = styled.div`
  display: flex;
  flex-direction: column;
`;
const ContentBox = styled.div`
  width: 100%;
  position: relative;
  margin-top: 89px;
`;
const ReadMoreSection = styled.div`

  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 20px;
  letter-spacing: -0.1px;
  color: #9a9a9a;
  float: left;
  position: relative;
  width: 100%;
`;
const TextSection = styled.div`
  margin-right: 109px;
  overflow: hidden;
  height: 44px;
`;
const Stats = styled.div`
  display: flex;
  flex-direction: row;
`;

const NftsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-conent: center;
  height: auto;
  width: 328px;
  margin-top: 24px;
  margin-right: 24px;
  margin-left: 24px;
  background: white;
  border-radius: 12px;
  background: linear-gradient(
    180deg,
    rgba(21, 21, 21, 0.84) 0%,
    rgba(21, 21, 21, 0.5) 40.67%,
    rgba(255, 255, 255, 0) 100%
  );
  align-items: center !important;
`;

const NftsTextContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  width: 305px;
  height: 110px;
  background: #242424;
  border-radius: 0px 0px 12px 12px;
  padding: 5px;
`;

const MyNftsImage = styled.div`
  width: 307px;
  height: 307px;
  background: gray;
  border-radius: 12px;
`;

const FilterBar = styled.div`
  display: flex;
  flex-direction: row;
  padding: 24px;
  width: 100%;
  height: 96px;
`;

const Searchbar = styled.input`
  width: 100%;
  height: 40px;
  margin-right: 8px;
  border: 1px solid #242424;
  border-radius: 12px;
  background: ${(props) => props.theme.colors.BLACK};
`;
const Sorting = styled.select`
  width: 169px;
  height: 40px;
  border: 1px solid #242424;
  border-radius: 12px;
  margin-right: 8px;
  background: ${(props) => props.theme.colors.BLACK};
`;

const SVGItems = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: 1px solid #242424;
  width: 40px;
  height: 40px;
  border-radius: 8px;
`;

const LargeItems = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5 21C4.45 21 3.979 20.8043 3.587 20.413C3.19567 20.021 3 19.55 3 19V5C3 4.45 3.19567 3.979 3.587 3.587C3.979 3.19567 4.45 3 5 3H19C19.55 3 20.021 3.19567 20.413 3.587C20.8043 3.979 21 4.45 21 5V19C21 19.55 20.8043 20.021 20.413 20.413C20.021 20.8043 19.55 21 19 21H5ZM13 13V19H19V13H13ZM13 11H19V5H13V11ZM11 11V5H5V11H11ZM11 13H5V19H11V13Z"
        fill="#FEFEFE"
      />
    </svg>
  );
};

const RowsItems = () => {
  return (
    <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.5 9.5C1.08333 9.5 0.729333 9.354 0.438 9.062C0.146 8.77067 0 8.41667 0 8C0 7.58333 0.146 7.22933 0.438 6.938C0.729333 6.646 1.08333 6.5 1.5 6.5C1.91667 6.5 2.27067 6.646 2.562 6.938C2.854 7.22933 3 7.58333 3 8C3 8.41667 2.854 8.77067 2.562 9.062C2.27067 9.354 1.91667 9.5 1.5 9.5ZM1.5 3.5C1.08333 3.5 0.729333 3.354 0.438 3.062C0.146 2.77067 0 2.41667 0 2C0 1.58333 0.146 1.22933 0.438 0.938C0.729333 0.646 1.08333 0.5 1.5 0.5C1.91667 0.5 2.27067 0.646 2.562 0.938C2.854 1.22933 3 1.58333 3 2C3 2.41667 2.854 2.77067 2.562 3.062C2.27067 3.354 1.91667 3.5 1.5 3.5ZM1.5 15.5C1.08333 15.5 0.729333 15.354 0.438 15.062C0.146 14.7707 0 14.4167 0 14C0 13.5833 0.146 13.2293 0.438 12.938C0.729333 12.646 1.08333 12.5 1.5 12.5C1.91667 12.5 2.27067 12.646 2.562 12.938C2.854 13.2293 3 13.5833 3 14C3 14.4167 2.854 14.7707 2.562 15.062C2.27067 15.354 1.91667 15.5 1.5 15.5ZM6 15C5.71667 15 5.47933 14.904 5.288 14.712C5.096 14.5207 5 14.2833 5 14C5 13.7167 5.096 13.4793 5.288 13.288C5.47933 13.096 5.71667 13 6 13H17C17.2833 13 17.5207 13.096 17.712 13.288C17.904 13.4793 18 13.7167 18 14C18 14.2833 17.904 14.5207 17.712 14.712C17.5207 14.904 17.2833 15 17 15H6ZM6 9C5.71667 9 5.47933 8.904 5.288 8.712C5.096 8.52067 5 8.28333 5 8C5 7.71667 5.096 7.479 5.288 7.287C5.47933 7.09567 5.71667 7 6 7H17C17.2833 7 17.5207 7.09567 17.712 7.287C17.904 7.479 18 7.71667 18 8C18 8.28333 17.904 8.52067 17.712 8.712C17.5207 8.904 17.2833 9 17 9H6ZM6 3C5.71667 3 5.47933 2.90433 5.288 2.713C5.096 2.521 5 2.28333 5 2C5 1.71667 5.096 1.479 5.288 1.287C5.47933 1.09567 5.71667 1 6 1H17C17.2833 1 17.5207 1.09567 17.712 1.287C17.904 1.479 18 1.71667 18 2C18 2.28333 17.904 2.521 17.712 2.713C17.5207 2.90433 17.2833 3 17 3H6Z"
        fill="gray"
      />
    </svg>
  );
};

const BellIcon = () => {
  return (
    <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1 17C0.716667 17 0.479 16.904 0.287 16.712C0.0956668 16.5207 0 16.2833 0 16C0 15.7167 0.0956668 15.4793 0.287 15.288C0.479 15.096 0.716667 15 1 15H2V8C2 6.61667 2.41667 5.38733 3.25 4.312C4.08333 3.23733 5.16667 2.53333 6.5 2.2V1.5C6.5 1.08333 6.646 0.729333 6.938 0.438C7.22933 0.146 7.58333 0 8 0C8.41667 0 8.77067 0.146 9.062 0.438C9.354 0.729333 9.5 1.08333 9.5 1.5V2.2C10.8333 2.53333 11.9167 3.23733 12.75 4.312C13.5833 5.38733 14 6.61667 14 8V15H15C15.2833 15 15.5207 15.096 15.712 15.288C15.904 15.4793 16 15.7167 16 16C16 16.2833 15.904 16.5207 15.712 16.712C15.5207 16.904 15.2833 17 15 17H1ZM8 20C7.45 20 6.97933 19.8043 6.588 19.413C6.196 19.021 6 18.55 6 18H10C10 18.55 9.80433 19.021 9.413 19.413C9.021 19.8043 8.55 20 8 20ZM4 15H12V8C12 6.9 11.6083 5.95833 10.825 5.175C10.0417 4.39167 9.1 4 8 4C6.9 4 5.95833 4.39167 5.175 5.175C4.39167 5.95833 4 6.9 4 8V15Z"
        fill="#FEFEFE"
      />
    </svg>
  );
};

const UnWalletBalances = () => {

  return (
    <>
      <UnWalletBalancesCSS>
        <WBText1>Wallet Balances</WBText1>
        <ConnectButton>
          <TKButtonText1>Connect Wallet</TKButtonText1>
        </ConnectButton>
      </UnWalletBalancesCSS>
    </>
  );
};

const RecentActivity = () => {
  return (
    <>
      <RecentActivityCSS>
        <RecentActivityCSSText>Recent Activity</RecentActivityCSSText>
        <RecentActivityText>You just logged in.</RecentActivityText>
        <br />
        <br />
        <br />
        <br />
      </RecentActivityCSS>
    </>
  );
};

const UnRecentActivity = () => {
  return (
    <>
      <RecentActivityCSS>
        Recent Activity
        <br />
        <br />
        <br />
        <br />
      </RecentActivityCSS>
    </>
  );
};

const WalletBalances = () => {
  const { loggedIn, principal, actor } = useAuthContext();
  const { tokens, refreshAllBalances } = useTokensContext();
  const [selectedEscrow, setSelectedEscrow] = useState<any>();
  const [openConfirmation, setOpenConfirmation] = React.useState(false);
  const [selectdNFT, setSelectdNFT] = React.useState<any>();
  const [dialogAction, setDialogAction] = useState<any>();
  const [open, setOpen] = useState(false);
  const [escrow, setEscrow] = useState([1, 2, 3]);

  const Balance = async () => {
    const data = await actor?.balance_of_nft_origyn({ principal });
    const data2 = await data.ok.nfts;
    const data3 = await data.ok.escrow;
    setEscrow(data3);
  };

  const withdrawEscrow = async (escrow) => {
    setOpenConfirmation(true);
    setSelectedEscrow(escrow);
    setDialogAction('withdraw');
    setSelectdNFT(escrow.token_id);
    setOpen(false);
  };

  const handleClose = () => {
    setOpenConfirmation(false);
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClickClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    Balance();
  }, [tokens]);

  return (
    <>
      <WalletBalancesCSS>
        <WBText1>Wallet Balances</WBText1>
        {['OGY', 'ICP'].map((token, index) => (
          <div key={`${token}+${index}`}>
            <TokensCSS>
              <div>
                <TokenIcon symbol={token} /> <WBText2>{token}</WBText2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <WBText2>{`${tokens[token]?.balance}${' '}${token}`}</WBText2>
                <WBText3>{`${'$'}${tokens[token]?.balance * 2}`}</WBText3>
              </div>
            </TokensCSS>
          </div>
        ))}
        <WBupdate>Last update: HH:MM:SS, MM/DD/YY</WBupdate>
        <TKButton>
          <TKButtonText0> Transfer Tokens </TKButtonText0>
        </TKButton>
        <WalletTokens>
          <MTButton>
            <MTButtonText0> Manage Tokens</MTButtonText0>
          </MTButton>
        </WalletTokens>
        <WBText1>Manage Escrow</WBText1>
        <MTButton onClick={handleClick}>
          <MTButtonText0>
            {' '}
            {escrow.length > 0
              ? `${escrow.length}${' '}${'asset/s in escrow'}`
              : 'No assets in escrow'}
          </MTButtonText0>
        </MTButton>
        <FormControl fullWidth>
          <InputLabel>Wallet</InputLabel>
          <Select label="Wallet">
            <MenuItem>Plug</MenuItem>
            <MenuItem>II</MenuItem>
            <MenuItem>Stoic</MenuItem>
          </Select>
        </FormControl>
      </WalletBalancesCSS>

      <Dialog open={open} onClick={handleClickClose} style={{ borderRadius: '24px' }}>
        <div
          style={{
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '48px 20px 32px',
            gap: '32px',
            width: '530px',
          }}
        >
          <ModalTextBox>
            <ModalText>Manage Escrow</ModalText>
          </ModalTextBox>

          {escrow[0]
            ? escrow.map((esc: any, index) => (
                <EscrowItem>
                  <span>{esc.token_id}</span>
                  <div>
                    <span>{parseFloat((parseInt(esc.amount) * 1e-8).toString()).toFixed(9)}</span>
                    <span> </span>
                    <TokenIcon symbol={tokens[esc?.token?.ic?.symbol]?.icon} />
                    {esc?.token?.ic?.symbol}
                  </div>
                  <WithdrawButton onClick={() => withdrawEscrow(esc[index])}>
                    Withdraw
                  </WithdrawButton>
                </EscrowItem>
              ))
            : 'No escrows available'}
        </div>
      </Dialog>

      <ConfirmSalesActionModal
        open={openConfirmation}
        handleClose={handleClose}
        currentToken={selectdNFT}
        action={dialogAction}
        escrow={selectedEscrow}
      />
    </>
  );
};

const GuestScreen = () => {
  return (
    <>
      {/* -----------------Vault Box----------------------- */}
      <VaultBox>
        <VaultBoxTitle>Vault Dashboard</VaultBoxTitle>
      </VaultBox>

      {/* -----------------Grid----------------------- */}

      <GridMain>
        {/* -----------------Grid Main 1----------------------- */}

        <GridMain1>
          <div style={{ paddingBottom: '24px' }}>
            <UnWalletBalances />
          </div>
          <UnRecentActivity />
        </GridMain1>

        {/* -----------------Grid Main 2----------------------- */}

        <GridMain2></GridMain2>

        {/* --------------End------------------- */}
      </GridMain>
    </>
  );
};

const WalletPage = () => {
  const { loggedIn, principal, actor } = useContext(AuthContext);
  const { tokenId, canisterId } = useSessionContext();
  const [loader, setLoader] = useState(true);
  const [arrayt2, setArrayt2] = useState([]);
  const [dataArray, setDataArray] = useState([]);
  const [nftCreator1, setNftCreator1] = useState('unknown');
  const [nftCollection1, setNftCollection1] = useState('X');
  const [image, setImage] = useState('https://global-uploads.webflow.com/62389d118e225af7f581a554/623c85290116665a5b438d06_ORIGYN_Foundation_horizontal_white_RGB-p-500.png');
  const [collectionName, setCollectionName] = useState('Collection');
  const [nftDescription, setNftDescription] = useState('This is the NFT Description')

  const Balance = async () => {
    const data = await actor?.balance_of_nft_origyn({ principal });
    const data2 = await data.ok.nfts;
    setDataArray(data2);
  };

  interface MyNFT {
    nft_name?: string;
    nft_collection?: string;
    status?: string;
    id?: string;
    image?: string;
    collection?: string | number;
    creator?: string;
    collection_name?: string;
    description? : string;
  }

  const NFTData = async () => {
    let array2: MyNFT[] = [];
    let i;
    setLoader(false);
    console.log('this is 2',array2)
    for (i in dataArray) {
      const data = await actor?.nft_origyn(dataArray[i]);

      const nft: MyNFT = {
        nft_name:data?.ok?.metadata?.Class?.find(({ name }) => name === 'id')?.value?.Text,
        collection_name: data?.ok?.metadata?.Class?.find(
          ({ name }) => name === '__apps',
        )?.value?.Array?.thawed[0]?.Class?.find(({ name }) => name === 'data')?.value?.Class?.find(({ name }) => name === 'name')?.value?.Text,
        nft_collection: data?.ok?.metadata?.Class?.find(
          ({ name }) => name === '__apps',
        )?.value?.Array?.thawed[0]?.Class?.find(({ name }) => name === 'data')?.value?.Class[2]?.value?.Text,
        status: data.ok.current_sale[0],
        id: data?.ok?.metadata?.Class?.find(({ name }) => name === 'id')?.value?.Text,
        image: data?.ok?.metadata?.Class?.find(
          ({ name }) => name === 'library',
        )?.value?.Array?.thawed[1]?.Class?.find(({ name }) => name === 'location')?.value?.Text,
        collection: data?.ok?.metadata?.Class?.find(
          ({ name }) => name === '__apps',
        )?.value?.Array?.thawed[0]?.Class?.find(({ name }) => name === 'data')?.value?.Class?.find(({ name }) => name === 'total_in_collection')?.value?.Nat,
        creator: data?.ok?.metadata?.Class?.find(
          ({ name }) => name === '__apps',
        )?.value?.Array?.thawed[0]?.Class?.find(({ name }) => name === 'data')?.value?.Class?.find(({ name }) => name === 'collectionid')?.value?.Text,
        description: data?.ok?.metadata?.Class?.find(
          ({ name }) => name === '__apps',
        )?.value?.Array?.thawed[0]?.Class?.find(({ name }) => name === 'data')?.value?.Class?.find(({ name }) => name === 'description')?.value?.Text,
      };
      array2.push(nft);
      console.log('nft, ', nft)
      console.log('this is data,',data)
    }

    setArrayt2(array2);
  };

  console.log('this is arrayt2',arrayt2)


  const nftCollection = async () => {
    const filterData: any = Number(arrayt2[0].collection);
    setNftCollection1(filterData);
    setImage(`${'https://'}${canisterId}${'.raw.ic0.app/-/'}${arrayt2[0].id}${'/preview'}`);
    setCollectionName(`${arrayt2[0].collection_name}${' '}${'Collection'}`)
    setNftCreator1(arrayt2[0].creator)
    setNftDescription(arrayt2[0].description)
  };

  console.log(collectionName)

  useEffect(() => {
    nftCollection();
    Balance();
    NFTData();
  }, [actor, dataArray]);

  return (
    <>
      {loggedIn ? (
        <>
          {/* -----------------Vault Box----------------------- */}
          <VaultBox>
            <VaultBoxTitle>Vault Dashboard</VaultBoxTitle>
          </VaultBox>

          {/* -----------------Grid----------------------- */}

          <GridMain>
            {/* -----------------Grid Main 1----------------------- */}

            <GridMain1>
              <div style={{ paddingBottom: '24px' }}>
                <WalletBalances />
              </div>
            </GridMain1>

            {/* -----------------Grid Main 2----------------------- */}
            <GridMain2>
              <MainBox>
                <MainImage src={image} />
                <MainSection>
                  <MainBoxTitle>{collectionName}</MainBoxTitle>
                  <span style={{ paddingBottom: '8px', color: 'white' }}>
                    {' '}
                    Created by <b>{nftCreator1}</b>
                  </span>
                  <Stats>
                    <MainSection>
                      <span style={{ paddingRight: '48px', color: 'white', fontWeight: '600' }}>
                        {nftCollection1}
                      </span>
                      <span style={{ paddingRight: '48px', fontWeight: '600' }}>Main Items</span>
                    </MainSection>
                    <MainSection>
                      <span style={{ paddingRight: '48px', color: 'white', fontWeight: '600' }}>
                        <TokenIcon symbol={'OGY'} />-
                      </span>
                      <span style={{ paddingRight: '48px', fontWeight: '600' }}>Floor Price</span>
                    </MainSection>

                  </Stats>
                  <br />
                  <TextSection>
                    {nftDescription}
                  </TextSection>
                  <ReadMoreSection>Read More...</ReadMoreSection>
                </MainSection>
              </MainBox>
              <ContentBox>
                <FilterBar>
                  <Searchbar />
                  <Sorting />
                  <SVGItems>
                    <RowsItems />
                  </SVGItems>
                  <SVGItems>
                    <LargeItems />
                  </SVGItems>
                </FilterBar>

                <GridMain2NFTS>
                  {arrayt2.map((nfts, index) => (
                    <a key={index} style={{ textDecoration: 'none' }} href={`#/${nfts.id}`}>
                      <NftsContainer>
                        <MyNftsImage>
                          <img height="307px" style={{ borderRadius: '12px' }} src={`https://${canisterId}.raw.ic0.app/-/${nfts.id}/preview`} />
                        </MyNftsImage>
                        <NftsTextContainer>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ color: 'gray', padding: '3px' }}>
                              {nfts.collection_name}
                            </span>{' '}
                            <b>
                              <span style={{ color: 'white', padding: '5px' }}>
                                {nfts.nft_name}
                              </span>
                            </b>
                          </div>
                          <span style={{ color: 'white', padding: '5px' }}>
                            {nfts.status ? 'For Sale' : 'Not listed for sale'}
                          </span>
                        </NftsTextContainer>
                      </NftsContainer>
                    </a>
                  ))}
                </GridMain2NFTS>
              </ContentBox>
            </GridMain2>

            {/* --------------End------------------- */}
          </GridMain>
        </>
      ) : (
        <GuestScreen />
      )}
    </>
  );
};

export default WalletPage;

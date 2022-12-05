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
import { useAuthContext } from '@dapp/features-authentication';
import { useTokensContext } from '@dapp/features-tokens-provider';
import { WalletTokens } from '@dapp/features-components';
import { Button } from '@origyn-sa/origyn-art-ui';
import styled from 'styled-components';
import Theme from '../../../../../features/theme/src/styles/Theme';
import Collection from '../../components/Collection';

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
  height: 520px;
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

const H5Text = styled.span`
  text-align: center;
  font-weight: 500;
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

const MyCollectabelsCSS = styled.div`
  position: relative;
  float: left;
  height: 307px;
  width: 307px;
  margin: 24px;
  background: linear-gradient(
    180deg,
    rgba(21, 21, 21, 0.84) 0%,
    rgba(21, 21, 21, 0.5) 40.67%,
    rgba(255, 255, 255, 0) 100%
  );
  border: 1px solid gray;
`;
const DumyNFT1 = styled.div`
  position: relative;
  float: left;
  height: 307px;
  width: 307px;
  margin: 24px;
  background: linear-gradient(
    180deg,
    rgba(21, 21, 21, 0.84) 0%,
    rgba(21, 21, 21, 0.5) 40.67%,
    rgba(255, 255, 255, 0) 100%
  );
  border-radius: 12px;
  background-image: url('https://static01.nyt.com/images/2021/03/12/arts/11nft-auction1/merlin_184196682_72b9e0cc-4062-40bd-9fb3-428d36cf99ab-superJumbo.jpg?quality=75&auto=webp');
  background-size: cover;
  background-attachment: scroll;
  background-position: center-center;
`;

const DumyNFT2 = styled.div`
  position: relative;
  float: left;
  height: 307px;
  width: 307px;
  margin: 24px;
  background: linear-gradient(
    180deg,
    rgba(21, 21, 21, 0.84) 0%,
    rgba(21, 21, 21, 0.5) 40.67%,
    rgba(255, 255, 255, 0) 100%
  );
  border-radius: 12px;
  background-image: url('https://static01.nyt.com/images/2021/03/11/arts/11nft-auction3/merlin_184196610_cd2f1557-7871-4004-bca0-004ee1f1f7d6-superJumbo.jpg?quality=75&auto=webp');
  background-size: cover;
  background-attachment: scroll;
  background-position: center-center;
`;

const DumyNFT3 = styled.div`
  position: relative;
  float: left;
  height: 307px;
  width: 307px;
  margin: 24px;
  background: linear-gradient(
    180deg,
    rgba(21, 21, 21, 0.84) 0%,
    rgba(21, 21, 21, 0.5) 40.67%,
    rgba(255, 255, 255, 0) 100%
  );
  border-radius: 12px;
  background-image: url('https://static01.nyt.com/images/2021/03/11/arts/11nft-auction4/merlin_184196712_6ff72329-5e5a-441d-886b-98912b4550f6-superJumbo.jpg?quality=75&auto=webp');
  background-size: cover;
  background-attachment: scroll;
  background-position: center-center;
`;

const TestNFT = styled.div`
  position: relative;
  float: left;
  height: 307px;
  width: 307px;
  margin: 24px;
  background: linear-gradient(
    180deg,
    rgba(21, 21, 21, 0.84) 0%,
    rgba(21, 21, 21, 0.5) 40.67%,
    rgba(255, 255, 255, 0) 100%
  );
  border-radius: 12px;
  border: 2px solid white;
`;

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


  const MyCollectabels = () => {};


  const UnWalletBalances = () => {
    const { logIn } = useContext(AuthContext);

    return (
      <>
        <UnWalletBalancesCSS>
          <WBText1>Wallet Balances</WBText1>
          <TKButton onClick={() => logIn('plug')}>
            <TKButtonText1>Connect Wallet</TKButtonText1>
          </TKButton>
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
  const { logIn, loggedIn, principal, logOut } = useAuthContext();
  const { tokens, refreshAllBalances } = useTokensContext();

  useEffect(() => {
    if (tokens.OGY.balance === -1) {
      refreshAllBalances();
    }
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
        <TKButton>
          <TKButtonText0> Transfer Tokens </TKButtonText0>
        </TKButton>
        <WalletTokens>
          <MTButton>
            <MTButtonText0> Manage Tokens</MTButtonText0>
          </MTButton>
        </WalletTokens>
        <WBupdate>Last update: HH:MM:SS, MM/DD/YY</WBupdate>
        <FormControl fullWidth>
          <InputLabel>Wallet</InputLabel>
          <Select label="Wallet">
            <MenuItem>Plug</MenuItem>
            <MenuItem>II</MenuItem>
            <MenuItem>Stoic</MenuItem>
          </Select>
        </FormControl>
      </WalletBalancesCSS>
    </>
  );
};

const GuestScreen = () => {
    const { logIn } = useContext(AuthContext);
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

          <GridMain2>
            <GridMain2Top>
              <GridMain2TitleBox>
                <GridMain2Title>
                  {' '}
                  My Collectables {`${'('}${false ? nft.length : 0}${')'}`}
                </GridMain2Title>
              </GridMain2TitleBox>

              <GridMain2Icon>
                <BellIcon />
              </GridMain2Icon>
            </GridMain2Top>
          </GridMain2>

          {/* --------------End------------------- */}
        </GridMain>
      </>
    );
  };



const WalletPage = () => {
    const { loggedIn, tokenId, canisterId, principal, actor } = useContext(AuthContext);
    const { tokens } = useTokensContext();

   // ------------------------------------------



   const NFTCardsExample = (props: any) => {
    return (
      <>
        {actor?.balance_of_nft_origyn({ principal }).then((response: any) => {
          response?.ok?.nfts?.map((nft) =>
            actor?.nft_origyn(nft).then((r: any) => (
              <div>
                <span>
                  {
                    r.ok.metadata.Class.find(
                      ({ name }) => name === '__apps',
                    ).value.Array.thawed[0].Class.find(({ name }) => name === 'data').value.Class[0]
                      .value.Text
                  }
                </span>
              </div>
            )),
          );
        })}
      </>
    );
  };

  const [nftName, setNftName] = useState('1');

  const [loader, setLoader] = useState(true);

  const NFT1 = async () => {
    const nft1_name = await actor?.nft_origyn('bm-1');

    setNftName(
      nft1_name.ok.metadata.Class.find(
        ({ name }) => name === '__apps',
      ).value.Array.thawed[0].Class.find(({ name }) => name === 'data').value.Class[0].value.Text,
    );
    setLoader(false);
  };

  const NFTDATA = async () => {
    const sample = ['bm-1', 'bm-2', 'bm-3', 'bm-4'];
    const array1 = [];
    sample.map((nfts) => {
      array1.push(actor?.nft_origyn(nfts));
    });

    console.log(array1);
  };

  useEffect(() => {
    NFTDATA();
  }, []);

  const NFT2 = () => {
    return (
      <span
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
          padding: '40px',
        }}
      >
        {nftName}
      </span>
    );
  };

  const NFTCards = async () => {
    console.log('This is data', nftName);

    const nft1_number = await actor
      ?.nft_origyn('bm-1')
      .then((r: any) =>
        Number(
          r.ok.metadata.Class.find(
            ({ name }) => name === '__apps',
          ).value.Array.thawed[0].Class.find(({ name }) => name === 'data').value.Class[1].value
            .Nat,
        ),
      );

    const nft1_collection = await actor
      ?.nft_origyn('bm-1')
      .then(
        (r: any) =>
          r.ok.metadata.Class.find(
            ({ name }) => name === '__apps',
          ).value.Array.thawed[0].Class.find(({ name }) => name === 'data').value.Class[2].value
            .Text,
      );

    console.log('This is nft1_number: ', nft1_number);
    console.log('This is nft1_collection: ', nft1_collection);
  };

  useEffect(() => {
    NFT1();
  }, []);

  // ------------------------------------------

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
              <RecentActivity />
            </GridMain1>

            {/* -----------------Grid Main 2----------------------- */}
            <GridMain2>
              <GridMain2Top>
                <GridMain2TitleBox>
                  <GridMain2Title>
                    {' '}
                    {/* My Collectables {`${'('}${false ? nft.length : 0}${')'}`} */}
                    My Collectables {`${'('}${3}${')'}`}
                  </GridMain2Title>
                </GridMain2TitleBox>

                <GridMain2Icon>
                  <BellIcon />
                </GridMain2Icon>
              </GridMain2Top>

              <GridMain2NFTS>
                <DumyNFT1 />
                <DumyNFT2 />
                <DumyNFT3 />
                {loader ? (
                  <span>Is Loading </span>
                ) : (
                  <TestNFT>
                    <NFT2 />
                  </TestNFT>
                )}
              </GridMain2NFTS>
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
import React from 'react';
import styled from 'styled-components';
import { applyStyleModifiers } from "styled-components-modifiers";

export const DappMainBox = styled.div`
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

export const DappMainBoxTitle = styled.span`
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
export const GridMain = styled.div`
  display: flex;
  flex-direction: row;
  border-top: 1px solid ${(props) => props.theme.colors.BLACK_DARK};
  padding-top: 24px;
  padding-left: 24px;
  padding-right: 24px;
  background: ${(props) => props.theme.colors.BLACK};
`;

export const GridMain1 = styled.div`
  padding-right: 24px;
`;

export const GridMain2 = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const GridMain2TitleBox = styled.div`
  width: 50%;
  height: auto;
  position: relative;
  float: left;
  text-align: left; ;
`;

export const GridMain2Top = styled.div`
  width: 100%;
  height: 56px;
  border-bottom: 1px solid ${(props) => props.theme.colors.BLACK_DARK};
`;

export const GridMain2Icon = styled.div`
  width: 50%;
  height: auto;
  position: relative;
  float: left;
  text-align: right;
`;

export const GridMain2Title = styled.span`
  font-family: ${(props) => props.theme.font.FONT_FAMILY_1};
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  letter-spacing: -0.25px;
  color: ${(props) => props.theme.colors.BG_TEXT};
  padding-bottom: 24px;
`;

export const WalletBalancesCSS = styled.div`
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

export const UnWalletBalancesCSS = styled.div`
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
export const RecentActivityCSS = styled.div`
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

export const RecentActivityCSSText = styled.span`
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

export const TKButtonText0 = styled.span`
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

export const MTButtonText0 = styled.span`
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

export const TKButtonText1 = styled.span`
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

export const WBText1 = styled.span`
  font-family: ${(props) => props.theme.font.FONT_FAMILY_1};
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: -0.2px;
  color: ${(props) => props.theme.colors.BG_TEXT};
`;

export const WBText2 = styled.span`
  font-family: ${(props) => props.theme.font.FONT_FAMILY_1};
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 22px;
  text-align: right;
  letter-spacing: -0.15px;
  color: ${(props) => props.theme.colors.BG_TEXT};
`;

export const WBText3 = styled.span`
  font-family: ${(props) => props.theme.font.FONT_FAMILY_1};
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  text-align: right;
  letter-spacing: -0.15px;
  color: ${(props) => props.theme.colors.GRAY};
`;

export const TokensCSS = styled.div`
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

export const Button1 = styled.button`
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

export const MTButton = styled.button`
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

export const WBupdate = styled.span`
  font-family: ${(props) => props.theme.font.FONT_FAMILY_1};
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 16px;
  letter-spacing: -0.1px;
  color: #${(props) => props.theme.colors.DARK_GRAY};
`;

export const ModalTextBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 24px;
`;

export const ModalText = styled.span`
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

export const EscrowItem = styled.div`
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

export const WithdrawButton = styled.button`
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

export const GridMain2Tabs = styled.div`
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

export const RecentActivityText = styled.span`
  font-family: ${(props) => props.theme.font.FONT_FAMILY_1};
  color: ${(props) => props.theme.colors.WHITE};
  marginright: '5px';
  marginbottom: '-3px';
  border: '2px solid ${(props) => props.theme.colors.GRAY}';
  borderradius: '12px';
  padding: '10px';
`;

export const GridMain2NFTS = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const MainBox = styled.div`
  flex-direction: row;
  align-items: flex-start;
  padding: 48px 24px;
  gap: 24px;
  width: 100%;
  height: 190px;  
  background: ${(props) => props.theme.colors.BLACK};
`;

//width: 240px for MainBox

export const MainBoxTitle = styled.span`
  font-family: ${(props) => props.theme.font.FONT_FAMILY_1};
  font-style: normal;
  font-weight: 500;
  font-size: 32pt;
  line-height: 40px;
  letter-spacing: -1px;
  color: ${(props) => props.theme.colors.BG_TEXT};
  mix-blend-mode: normal;
  flex: none;
  align-self: stretch;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

export const MainImage = styled.img`
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

export const MainSection = styled.div`
  display: flex;
  flex-direction: column;
`;
export const ContentBox = styled.div`
  width: 100%;
  position: relative;
  margin-top: 89px;
`;
export const ReadMoreSection = styled.div`

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
export const TextSection = styled.div`
  margin-right: 109px;
  overflow: hidden;
  height: 44px;
`;
export const Stats = styled.div`
  display: flex;
  flex-direction: row;
`;

export const NftsContainer = styled.div`
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

export const NftsTextContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  width: 305px;
  height: 110px;
  background: #242424;
  border-radius: 0px 0px 12px 12px;
  padding: 5px;
`;

export const MyNftsImage = styled.div`
  width: 307px;
  height: 307px;
  background: gray;
  border-radius: 12px;
`;

export const FilterBar = styled.div`
  display: flex;
  flex-direction: row;
  padding: 24px;
  width: 100%;
  height: 96px;
`;

export const Searchbar = styled.input`
  width: 100%;
  height: 40px;
  margin-right: 8px;
  border: 1px solid #242424;
  border-radius: 12px;
  background: ${(props) => props.theme.colors.BLACK};
`;
export const Sorting = styled.select`
  width: 169px;
  height: 40px;
  border: 1px solid #242424;
  border-radius: 12px;
  margin-right: 8px;
  background: ${(props) => props.theme.colors.BLACK};
`;

export const SVGItems = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: 1px solid #242424;
  width: 40px;
  height: 40px;
  border-radius: 8px;
`;
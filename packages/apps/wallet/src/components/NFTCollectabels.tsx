import React from 'react';
import styled from 'styled-components';
import { SearchbarNft } from '@dapp/features-components';

const MainBox = styled.div`
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
  padding: 48px 0px 48px 24px;
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
  margin-right: 24px;
  margin-left: 24px;
  margin-bottom: 24px;
  border-radius: 12px;
  background: gray;
`;

const NFTSBox = styled.div`
  width: 100%;
  height: 100%;
  padding: 12px;
  background: ${(props) => props.theme.colors.BLACK}

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

const NFTCollectables = () => {
  return (
    <div style={{width: '100%'}}>
      <MainBox>
        <MainBoxTitle>My Collectables</MainBoxTitle>
      </MainBox>

      <NFTSBox>
        <FilterBar>
          <Searchbar />
          <Sorting />
          <SVGItems>
            <RowsItems/>
          </SVGItems>
          <SVGItems>
          <LargeItems />
          </SVGItems>
        </FilterBar>

        <GridMain2NFTS>
          <MyCollectabelsCSS/>
          <MyCollectabelsCSS/>
          <MyCollectabelsCSS/>
          <MyCollectabelsCSS/>
          <MyCollectabelsCSS/>
          <MyCollectabelsCSS/>
          <MyCollectabelsCSS/>
        </GridMain2NFTS>
      </NFTSBox>
    </div>
  );
};

export default NFTCollectables;

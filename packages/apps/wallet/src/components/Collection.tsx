import React from "react"
import styled from 'styled-components';
import { TokenIcon } from "@dapp/features-components";

const MainBox = styled.div`
display: flex;
flex-direction: row;
align-items: flex-start;
padding: 48px 24px;
gap: 24px;
width: 100%;
height: 240px;
background: ${(props) => props.theme.colors.BLACK};
border-top: 1px solid #242424;
border-radius: 16px 0px 0px 0px;
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

`;

const MainImage = styled.div`
width: 96px;
height: 96px;
border: 1px solid gray;
`

const MainSection = styled.div`
display: flex;
flex-direction: column;
`

const Stats = styled.div`
display: flex;
flex-direction: row;
`

const GridMain2NFTS = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const MyCollectabelsCSS = styled.div`
  position: relative;
  float: left;
  height: 307px;
  width: 307px;
  margin-top: 24px;
  margin-right: 24px;
  margin-left: 24px;
  bodrer: 10px solid white;
  background: linear-gradient(
    180deg,
    rgba(21, 21, 21, 0.84) 0%,
    rgba(21, 21, 21, 0.5) 40.67%,
    rgba(255, 255, 255, 0) 100%
  );
`;


const Collection = () => {

    return (
        <>
        <MainBox>
            <MainImage><img src='./NFT1'/></MainImage>
            <MainSection>
            <MainBoxTitle>NFT Collection</MainBoxTitle>
            <span style={{paddingBottom:'8px',color: 'white'}}> Created by <b>Creator</b></span>
            <Stats>
                <MainSection>
                <span style={{paddingRight:'48px', color: 'white', fontWeight:'600'}}>12</span>
                <span style={{paddingRight:'48px', fontWeight:'600'}}>Main Items</span>
                </MainSection>
                <MainSection>   
                <span style={{paddingRight:'48px', color: 'white', fontWeight:'600'}}><TokenIcon symbol={'OGY'}/>3000</span>
                <span style={{paddingRight:'48px', fontWeight:'600'}}>Highest Bid</span>
                </MainSection>
                <MainSection>
                <span style={{paddingRight:'48px', color: 'white', fontWeight:'600'}}><TokenIcon symbol={'OGY'}/>250</span>
                <span style={{paddingRight:'48px', fontWeight:'600'}}>Lowest Bid</span>
                </MainSection>
                <MainSection>
                <span style={{paddingRight:'48px', color: 'white', fontWeight:'600'}}><TokenIcon symbol={'OGY'}/>120K</span>
                <span style={{paddingRight:'48px', fontWeight:'600'}}>Total Value</span>
                </MainSection>
            </Stats>
            </MainSection>
        </MainBox>

        <GridMain2NFTS>
          <MyCollectabelsCSS>
            <img src="../../src/components/NFT1.png"></img>
          </MyCollectabelsCSS>
          <MyCollectabelsCSS>
            <img src="../../src/components/NFT2.png"></img>
          </MyCollectabelsCSS>
          <MyCollectabelsCSS>
            <img src="../../src/components/NFT3.png"></img>
          </MyCollectabelsCSS>
          <MyCollectabelsCSS>
            <img src="../../src/components/NFT4.png"></img>
          </MyCollectabelsCSS>
          <MyCollectabelsCSS>
            <img src="../../src/components/NFT1.png"></img>
          </MyCollectabelsCSS>
          <MyCollectabelsCSS>
            <img src="../../src/components/NFT2.png"></img>
          </MyCollectabelsCSS>
          <MyCollectabelsCSS>
            <img src="../../src/components/NFT3.png"></img>
          </MyCollectabelsCSS>
          <MyCollectabelsCSS>
            <img src="../../src/components/NFT4.png"></img>
          </MyCollectabelsCSS>
          <MyCollectabelsCSS>
            <img src="../../src/components/NFT1.png"></img>
          </MyCollectabelsCSS>
          <MyCollectabelsCSS>
            <img src="../../src/components/NFT2.png"></img>
          </MyCollectabelsCSS>
          <MyCollectabelsCSS>
            <img src="../../src/components/NFT3.png"></img>
          </MyCollectabelsCSS>
          <MyCollectabelsCSS>
            <img src="../../src/components/NFT4.png"></img>
          </MyCollectabelsCSS>
        </GridMain2NFTS>
        </>
    )
}

export default Collection
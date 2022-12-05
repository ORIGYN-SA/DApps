import React, { useContext, useState, useEffect } from 'react';
import HomeIcon from './home';
import GovernanceIcon from './governance';
import ThemeIcon from './theme';
import WalletIcon from './wallet';
import OrigynIcon from './origyn';
import { Button } from '@origyn-sa/origyn-art-ui';
import styled from 'styled-components';
import ThemeConfig, { SiteContext } from '@dapp/features-theme';
import { AuthContext } from '@dapp/features-authentication';
import 'react-toastify/dist/ReactToastify.css';
import './connect2ic.css';
import { ConnectButton } from '@connect2ic/react';
import { useAuthContext, useSessionContext } from '@dapp/features-authentication';

/* gap between container 1 and container 2 */
const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 0px 24px;
  align-items: center;
  position: fixed;
  height: 100%;
  bottom: 0px;
  left: 0px;
  justify-content: space-between;
  float: left;
  width: 104px;
  height: 'calc(100% - 104px)';
  flex-grow: 1;
  background: black;
`;

/* asked kenneth, height should be set to 100% instead of 900px

 */

/* .flex-container is whole component,
 container 1 and 2 are children */

/* gap between div 1 and div 2 */

const NavigationTop = styled.div`
position:fixed;
left:104px!important;
top:0px!important;
display: flex;
flex-direction: row;
align-items: center;
justify-content: space-between;
padding: 0px 24px;
gap: 24px;
width: 100%;
height: 80px;
float: right;
background: black;
z-index:999;
`;

const NavigationTopText = styled.span`
  font-family: ${(props) => props.theme.font.FONT_FAMILY_1};
  font-size: 14px;
  line-height: 22px;
  letter-spacing: -0.15px;
  font-style: normal;
  font-weight: 600;
  color: ${(props) => props.theme.colors.BG_TEXT};
`;

const Container1 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  list-style: none;
  padding: 0px;
  gap: 20px;
  width: 56px;
  height: 284px;
`;

const TopItem1 = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 24px 10px;
  gap: 10px;
  width: 56px;
  height: 80px;
`;

const TopItem2 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px;
  gap: 8px;
  width: 56px;
  height: 184px;
`;

const ItemHome = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 19px;
  width: 18px;
  height: 18px;
`;

// const itemHome :hover {
//   background: #f4e5f1;
//   border-radius: 999px;
// }

// .item-home :active {
//   background: #f4e5f1;
//   border-radius: 999px;
// }

const Item = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  list-style: none;
  padding: 19px;
  color: #5f5f5f;
  width: 18px;
  height: 18px;
`;

// .item :hover {
//   background: #f4e5f1;
//   border-radius: 999px;
// }

// .item :active {
//   background: #f4e5f1;
//   border-radius: 999px;
// ;
// }

/* gap between div 1 and div 2 */
const Container2 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px;
  gap: 24px;
  width: 76px;
  height: 88px;
`;

const BottomItem1 = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 6px 12px;
  width: 76px;
  height: 32px;
  border-radius: 999px;
`;

const BottomItem2 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 7px;
  gap: 10px;
  width: 32px;
  height: 32px;
`;

const ConnectedButton = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 6px 8px;
  gap: 8px;
  width: 65px;
  height: 32px;
  background: #151515;
  border: 1px solid #242424;
  border-radius: 12px;
`;
const ChildrenContainer = styled.div`
  margin-top: 80px;
  margin-left: 104px;
  flexGrow: '1',
  display: 'flex', 
  height: 'calc(100% - 104px)',
  width: 'calc(100% - 104px)',
  background: 'black',
  flexDirection:'column'
  `;

// const bottomItem2 :hover {
//   background: #f4e5f1;
//   border-radius: 999px;
// }

const Template = (args: any) => {
  let component;
  // switch (window.location.pathname) {
  //   case "/home":
  //     component = <Home />;
  //     break;
  //   case "/governance":
  //     component = <Governance />;
  //     break;
  //   case "/team":
  //     component = <Wallet />;
  //     break;
  // }

  return (
    <>
      <Navbar>
        {/* will add icons svg's instead of text */}
        <ItemHome>
          <CustomLink href="/home">
            <HomeIcon />
          </CustomLink>
        </ItemHome>

        <Item>
          <CustomLink href="https://governance.origyn.network">
            <GovernanceIcon />
          </CustomLink>
        </Item>
        <Item>
          <CustomLink className="item" href="/wallet">
            <WalletIcon />
          </CustomLink>
        </Item>
      </Navbar>

      <div className="container">{component}</div>
    </>
  );
};

const Navbar = ({ children }) => {
  const { onChangeMode, themeMode }: any = useContext(SiteContext);
  const { loggedIn, principal, handleLogOut } = useAuthContext();

  return (
    <ThemeConfig>
      <FlexContainer>
        {/* container 1 */}
        <Container1>
          <TopItem1>
            <OrigynIcon />
          </TopItem1>
          <ItemHome>
            <CustomLink href="/home">
              <HomeIcon />
            </CustomLink>
          </ItemHome>

          <Item>
            <CustomLink className="item" href="/wallet">
              <WalletIcon />
            </CustomLink>
          </Item>
        </Container1>

        {/* container 2 */}
        <Container2>
          <BottomItem2>
            <ThemeIcon />
          </BottomItem2>
        </Container2>
      </FlexContainer>
      <NavigationTop>
        <NavigationTopText>Vault</NavigationTopText>
        <div style={{marginRight: '120px'}}>
        <ConnectButton/>
        </div>
      </NavigationTop>
      <ChildrenContainer>{children}</ChildrenContainer>
    </ThemeConfig>
  );
};

const CustomLink = ({ href, children, ...props }) => {
  const path = window.location.pathname;

  return (
    <li className={path === href ? ' active ' : ' '}>
      <a href={href} {...props}>
        {children}
      </a>
    </li>
  );
};

export default Navbar;

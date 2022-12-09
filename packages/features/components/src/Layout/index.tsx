import { Flex, Navbar, SecondaryNav } from '@origyn-sa/origyn-art-ui'
import { Icons, theme } from "@origyn-sa/origyn-art-ui";
import React, { useContext, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthContext } from '@dapp/features-authentication';
import { useTokensContext } from '@dapp/features-tokens-provider';
import styled, { ThemeProvider, createGlobalStyle} from "styled-components";
import zIndex from '@mui/material/styles/zIndex';

// TODO: get APPS from NFT data
const initialMenuItems: MenuItem[] = [
  {
    href: 'Home',
    title: 'Ledger',
    icon: Icons.Home
  },
  {
    href: 'Vault',
    title: 'NFT info',
    icon: Icons.Wallet
  },
];

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Montserrat', Arial, sans-serif;
    margin: 0;
    padding: 0;
  }
  body {
    background-color: #000000;
    font-family: 'Montserrat', Arial, sans-serif;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: -0,2;
  }
  a {
    color: inherit;
    text-decoration: inherit;
  }
  
  .noShrink {
    flex-shrink: 0;
  }
  h1 {
    font-weight: 500;
    font-size: 36px;
    line-height: 44px;
    letter-spacing: -1;
  }
  h2 {
    font-weight: 500;
    font-size: 32px;
    line-height: 40px;
    letter-spacing: -0,75;
  }
  h3 {
    font-weight: 500;
    font-size: 28px;
    line-height: 36px;
    letter-spacing: -0,5;
  }
  h4 {
    font-weight: 500;
    font-size: 24px;
    line-height: 32px;
    letter-spacing: -0,25;
  }
  h5 {
    font-weight: 500;
    font-size: 20px;
    line-height: 28px;
    letter-spacing: -0,15;
  }
  h6 {
    font-weight: 500;
    font-size: 18px;
    line-height: 26px;
    letter-spacing: -0,1;
  }
  button, .buttonLabel {
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  .largeText {
    font-weight: 500;
    font-size: 17px;
    line-height: 24px;
  }
  .smallText {
    font-weight: 500;
    font-size: 13px;
    line-height: 18px;
  }
  
  @media (min-width: 600px) {
    h1 {
      font-size: 28px;
      line-height: 38px;
    }
    h2 {
      font-size: 24px;
      line-height: 36px;
    }
    h3 {
      font-size: 20px;
      line-height: 30px;
    }
    h4 {
      font-size: 17px;
      line-height: 24px;
    }
  }
  
  @media (min-width: 960px) {
    h1 {
      font-size: 32px;
      line-height: 44px;
    }
    h2 {
      font-size: 26px;
      line-height: 38px;
    }
  }
  
  @media (min-width: 1280px) {
    h1 {
      font-size: 36px;
      line-height: 48px;
    }
    h2 {
      font-size: 30px;
      line-height: 40px;
    }
    h3 {
      font-size: 24px;
      line-height: 36px;
    }
  }
`

const FixedNavbar = styled(Navbar)`
position: fixed!important;
top: 0;
left: 0;
z-index: 999;
height: 100%;
`
export const Layout = ({ children }: LayoutProps) => {

  const { logIn } = useAuthContext();
  const { tokens, refreshAllBalances } = useTokensContext();

  useEffect(() => {
    if (tokens.OGY.balance === -1) {
      refreshAllBalances();
    }
  }, [tokens]);

  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Flex fullWidth>
          <FixedNavbar navItems={initialMenuItems} />
            <Flex fullWidth>
                {children}
            </Flex>
        </Flex>
      </ThemeProvider>
    </>
  );
};

export type MenuItem = {
  href: string;
  title: string;
  icon: any;
};

export type LayoutProps = {
  children: JSX.Element;
  menuItems?: MenuItem[];
};

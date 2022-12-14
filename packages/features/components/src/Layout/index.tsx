import { Flex, GlobalStyle, Navbar } from '@origyn-sa/origyn-art-ui'
import { Icons, theme, themeLight } from "@origyn-sa/origyn-art-ui";
import React, { useContext, useEffect, useState } from 'react'
import 'react-toastify/dist/ReactToastify.css';
import { useTokensContext } from '@dapp/features-tokens-provider';
import { ThemeProvider } from "styled-components";
import { isLocal } from '@dapp/utils';
import './connect2ic.css';
import { AuthContext } from '../../../authentication'

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

export const Layout = ({ children }: LayoutProps) => {
  const { tokens, refreshAllBalances } = useTokensContext();
  const { principal, loggedIn, handleLogOut } = useContext(AuthContext)
  const [darkTheme, setDarkTheme] = useState(true);

  console.log(loggedIn);
  useEffect(() => {
    if (loggedIn) {
      console.log(principal.toText(), isLocal());
      refreshAllBalances(false, principal);
    }
  }, [loggedIn]);
  return (
    <>
      <ThemeProvider theme={darkTheme ? theme : themeLight}>
        <GlobalStyle />
        <Flex fullWidth mdFlexFlow="column">
          <Navbar navItems={initialMenuItems} onChangeTheme={() => setDarkTheme(!darkTheme)} />
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

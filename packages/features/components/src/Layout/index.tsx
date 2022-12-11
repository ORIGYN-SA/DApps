import { Flex, GlobalStyle, Navbar } from '@origyn-sa/origyn-art-ui'
import { Icons, theme, themeLight } from "@origyn-sa/origyn-art-ui";
import React, { useContext, useEffect, useState } from 'react'
import 'react-toastify/dist/ReactToastify.css';
import { useTokensContext } from '@dapp/features-tokens-provider';
import { ThemeProvider, createGlobalStyle} from "styled-components";

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
  const [darkTheme, setDarkTheme] = useState(true);

  useEffect(() => {
    if (tokens.OGY.balance === -1) {
      refreshAllBalances();
    }
  }, [tokens]);

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

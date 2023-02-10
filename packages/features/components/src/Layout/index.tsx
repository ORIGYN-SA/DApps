import { Flex, GlobalStyle, Navbar } from '@origyn-sa/origyn-art-ui';
import { Icons, theme, themeLight } from '@origyn-sa/origyn-art-ui';
import React, { useContext, useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { useTokensContext } from '@dapp/features-tokens-provider';
import { ThemeProvider } from 'styled-components';
import './connect2ic.css';
import { AuthContext, useRoute } from '../../../authentication';
import { getNftCollectionMeta, OrigynClient } from '@origyn-sa/mintjs';
import { Disclaimer } from '../Disclaimer';

// TODO: get APPS from NFT data
const initialMenuItems: MenuItem[] = [
  {
    href: 'b2b-management.html',
    title: 'Dashboard',
    icon: Icons.Home,
  },
  {
    href: 'mintingB2B.html',
    title: 'Minting Application',
    icon: Icons.DataBrowse,
  },
];

export const Layout = ({ children }: LayoutProps) => {
  const { refreshAllBalances } = useTokensContext();
  const { principal, loggedIn } = useContext(AuthContext);
  const [darkTheme, setDarkTheme] = useState(false);
  const [menuItems, setMenuItems] = useState(initialMenuItems);

  useEffect(() => {
    if (loggedIn) {
      refreshAllBalances(false, principal);
    }
  }, [loggedIn]);

  return (
    <>
      <ThemeProvider theme={darkTheme ? theme : themeLight}>
        <GlobalStyle />
        <Disclaimer />
        <Flex fullWidth mdFlexFlow="column">
          <Navbar navItems={menuItems} onChangeTheme={() => setDarkTheme(!darkTheme)} />
          <Flex fullWidth>{children}</Flex>
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

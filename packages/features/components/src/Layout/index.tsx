import { Flex, GlobalStyle, Navbar } from '@origyn/origyn-art-ui';
import { Icons, theme, themeLight } from '@origyn/origyn-art-ui';
import React, { useContext, useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { useTokensContext } from '@dapp/features-tokens-provider';
import { ThemeProvider } from 'styled-components';
import './connect2ic.css';
import { AuthContext, useRoute } from '@dapp/features-authentication';
import { getNftCollectionMeta, OrigynClient } from '@origyn/mintjs';
import { Disclaimer } from '../Disclaimer';

// TODO: get APPS from NFT data
const initialMenuItems: MenuItem[] = [
  {
    href: '',
    title: 'Home',
    icon: Icons.Home,
  },
  {
    href: 'vault',
    title: 'Vault',
    icon: Icons.Wallet,
  },
  {
    href: 'data',
    title: 'Certificates Data',
    icon: Icons.DataBrowse,
  },
  {
    href: 'library',
    title: 'Certificates library',
    icon: Icons.Libraries,
  },
  {
    href: 'ledger',
    title: 'Ledger',
    icon: Icons.TransactionIcon,
  },
  {
    href: 'marketplace',
    title: 'Marketplace',
    icon: Icons.Marketplace,
  },
];

export const Layout = ({ children }: LayoutProps) => {
  const { refreshAllBalances } = useTokensContext();
  const { principal, loggedIn, actor } = useContext(AuthContext);
  const [darkTheme, setDarkTheme] = useState(true);
  const [menuItems, setMenuItems] = useState(initialMenuItems);

  useEffect(() => {
    if (loggedIn) {
      refreshAllBalances(false, principal);
    }
  }, [loggedIn]);

  useEffect(() => {
    useRoute().then(({ canisterId }) => {
      OrigynClient.getInstance().init(true, canisterId, { actor });
      getNftCollectionMeta([]).then((r: any) => {
        if (!('err' in r)) {
          const data = r.ok.metadata[0].Class.find(
            ({ name }) => name === 'library',
          ).value.Array.thawed.reduce(
            (arr, val) => [...arr, val.Class.find(({ name }) => name === 'library_id').value.Text],
            [],
          );
          setMenuItems(initialMenuItems.filter((item) => data.includes(item.href)));
        }
      });
    });
  }, []);

  return (
    <>
      <ThemeProvider theme={darkTheme ? theme : themeLight}>
        <GlobalStyle />
        <Disclaimer />
        <Flex fullWidth mdFlexFlow="column">
          <Navbar navItems={menuItems} onChangeTheme={() => setDarkTheme(!darkTheme)} />
          <p>Hello</p>
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

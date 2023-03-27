import { Flex, GlobalStyle, Navbar } from '@origyn/origyn-art-ui';
import { Icons, theme, themeLight } from '@origyn/origyn-art-ui';
import React, { useContext, useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { useTokensContext } from '@dapp/features-tokens-provider';
import { ThemeProvider } from 'styled-components';
import './connect2ic.css';
import { AuthContext, useRoute } from '@dapp/features-authentication';
import { getNftCollectionMeta, OrigynClient } from '@origyn/mintjs';

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
  const [darkTheme, setDarkTheme] = useState(null);
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

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme !== null) {
      setDarkTheme(savedTheme === 'true');
    }
  }, []);

  const handleThemeChange = () => {
    const newTheme: any = !darkTheme;
    setDarkTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <>
      <ThemeProvider theme={darkTheme ? theme : themeLight}>
        <GlobalStyle />
        <Flex fullWidth mdFlexFlow="column">
          <Navbar
            navItems={menuItems}
            onChangeTheme={() => handleThemeChange()}
            dAppsVersion="0.1.0"
            darkMode={darkTheme}
          />
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

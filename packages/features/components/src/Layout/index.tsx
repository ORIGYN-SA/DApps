import { Flex, GlobalStyle, Navbar } from '@origyn-sa/origyn-art-ui'
import { Icons, theme, themeLight } from '@origyn-sa/origyn-art-ui'
import React, { useContext, useEffect, useState } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import { useTokensContext } from '@dapp/features-tokens-provider'
import { ThemeProvider } from 'styled-components'
import './connect2ic.css'
import { AuthContext } from '../../../authentication'

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
    title: 'NFT Data',
    icon: Icons.DataBrowse,
  },
  {
    href: 'library',
    title: 'NFT library',
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
]

export const Layout = ({ children }: LayoutProps) => {
  const { refreshAllBalances } = useTokensContext()
  const { principal, loggedIn } = useContext(AuthContext)
  const [darkTheme, setDarkTheme] = useState(true)

  useEffect(() => {
    if (loggedIn) {
      refreshAllBalances(false, principal)
    }
  }, [loggedIn])

  return (
    <>
      <ThemeProvider theme={darkTheme ? theme : themeLight}>
        <GlobalStyle />
        <Flex fullWidth mdFlexFlow='column'>
          <Navbar navItems={initialMenuItems} onChangeTheme={() => setDarkTheme(!darkTheme)} />
          <Flex fullWidth>
            {children}
          </Flex>
        </Flex>
      </ThemeProvider>
    </>
  )
}

export type MenuItem = {
  href: string;
  title: string;
  icon: any;
};

export type LayoutProps = {
  children: JSX.Element;
  menuItems?: MenuItem[];
};

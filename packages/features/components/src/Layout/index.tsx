import { Flex, Navbar } from '@origyn-sa/origyn-art-ui';
import { Icons } from "@origyn-sa/origyn-art-ui";
import React, { useContext, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthContext } from '@dapp/features-authentication';
import ThemeConfig, { SiteContext } from '@dapp/features-theme';
import { useTokensContext } from '@dapp/features-tokens-provider';
import { ThemeProvider, createGlobalStyle } from "styled-components";

// TODO: get APPS from NFT data
const initialMenuItems: MenuItem[] = [
  {
    href: 'ledger',
    title: 'Ledger',
    icon: Icons.SafeIcon
  },
  {
    href: 'data',
    title: 'NFT info',
    icon: Icons.ProfileIcon
  },
  {
    href: 'wallet',
    title: 'Wallet',
    icon: Icons.TransactionIcon
  },
];

const theme = {
  colors: {
    BLACK: '#151515',
    VERY_DARK_GREY: '#4a4a4a',
    DARK_GREY: '#6F6F6F',
    MID_GREY: '#AEAEAE',
    LIGHT_GRAY: '#D8D8D8',
    VERY_LIGHTER_GRAY: '#F2F2F2',
    WHITE: '#F2F2F2',

    ERROR: '#E42932',
    PROGRESS: '#F2BD00',
    SUCCESS: '#50AA3E',

    ACCENT_COLOR: '#EE9907',
    ACCENT_COLOR_2: '#FFE7BD',

  },
  shadows: {
    sm: "0px 5px 5px -5px rgba(0, 0, 0, 0.1)",
    md: "0px 5px 10px -5px rgba(26, 32, 44, 0.1)",
    lg: "0px 10px 15px -3px rgba(26, 32, 44, 0.1), 0px 4px 6px -2px rgba(26, 32, 44, 0.05)",
  },
  typography: {

  },
  spacing: {

  },
  media: {
    sm: '@media (max-width: 600px)',
    md: '@media (max-width: 960px)',
    lg: '@media (max-width: 1280px)',
    xl: '@media (max-width: 1920px)',
  },
  containers: {
    sm: 905,
    md: 1150,
    lg: 1400,
  }
};
const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Montserrat', Arial, sans-serif;
    margin: 0;
    padding: 0;
  }
  body {
    background-color: #E5E5E5;
    font-family: 'Montserrat', Arial, sans-serif;
    font-size: 15px;
    line-height: 22px;
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
    font-size: 24px;
    line-height: 32px;
  }
  h2 {
    font-weight: 500;
    font-size: 20px;
    line-height: 28px;
  }
  h3 {
    font-weight: 500;
    font-size: 18px;
    line-height: 26px;
  }
  h4 {
    font-weight: 600;
    font-size: 15px;
    line-height: 22px;
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

export const Layout = ({ menuItems, children }: LayoutProps) => {
  const { onChangeMode, themeMode }: any = useContext(SiteContext);

  const { logIn, loggedIn, principal, logOut } = useAuthContext();
  const { tokens, refreshAllBalances } = useTokensContext();
  const toggleTheme = () => {
    const t = themeMode === 'light' ? 'dark' : 'light';
    onChangeMode(t);
  };

  const handleNavigation = (i) => {
    window.location.href =
      window.location.href.substr(0, window.location.href.lastIndexOf('\\') + 1) + i.page;
  };

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
          <Navbar navItems={initialMenuItems} onConnect={() => logIn('plug')} />
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

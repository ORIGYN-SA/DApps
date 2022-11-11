import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import DarkIcon from '@mui/icons-material/Brightness4Rounded';
import LightIcon from '@mui/icons-material/Brightness7Rounded';
import CheckIcon from '@mui/icons-material/Check';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import {
  Box,
  Divider,
  Drawer,
  Hidden,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { isLocal } from '@dapp/utils';
import { useAuthContext, useSessionContext } from '@dapp/features-authentication';
import { ConnectButton, ConnectDialog, useConnect } from '@connect2ic/react';
import ThemeConfig, { SiteContext } from '@dapp/features-theme';
import { useTokensContext } from '@dapp/features-tokens-provider';
import { ThemeLogo } from '../Logo';
import { WalletTokens } from '../WalletTokens';
import { TokenIcon } from '../TokenIcon';
import CircularProgress from '@mui/material/CircularProgress';
import './connect2ic.css';
import { LocalDevelopmentModal } from '../LocalDevelopmentModal';
import { Principal } from '@dfinity/principal';

const initialMenuItems: MenuItem[] = [
  {
    page: 'ledger',
    title: 'Ledger',
    icon: <ListAltOutlinedIcon />,
  },
  {
    page: 'data',
    title: 'NFT info',
    icon: <InfoOutlinedIcon />,
  },
  {
    page: 'wallet',
    title: 'Wallet',
    icon: <AccountBalanceWalletOutlinedIcon />,
  },
];

export const Layout = ({ menuItems, children }: LayoutProps) => {
  const { onChangeMode, themeMode }: any = useContext(SiteContext);

  const { loggedIn, principal, handleLogOut } = useAuthContext();
  const { tokens, refreshAllBalances } = useTokensContext();
  const { localDevelopment } = useSessionContext();

  const toggleTheme = () => {
    const t = themeMode === 'light' ? 'dark' : 'light';
    onChangeMode(t);
  };

  const handleNavigation = (i) => {
    window.location.href =
      window.location.href.substr(0, window.location.href.lastIndexOf('\\') + 1) + i.page;
  };

  useEffect(() => {
    if (principal && principal.toText() !== '2vxsx-fae') {
      refreshAllBalances(isLocal() && localDevelopment, principal);
    }
  }, [principal]);

  return (
    <>
      <ThemeConfig>
        <Box
          sx={{
            display: 'flex',
          }}
        >
          <Hidden lgDown>
            <Box width="320px" bgcolor="red">
              <Drawer variant="permanent" open>
                <Box width="320px">
                  <Box
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '1rem 2rem',
                    }}
                  >
                    <Box sx={{ padding: '8px' }}>
                      <ThemeLogo />
                    </Box>
                  </Box>
                  <Divider />
                  <Box>
                    <List>
                      {!loggedIn ? (
                        <>
                          <ListItem
                            button
                            style={{ justifyContent: 'center', flexDirection: 'column' }}
                          >
                            <ConnectButton />
                            {isLocal && (
                              <LocalDevelopmentModal>
                                <Link>Local Development Settings</Link>
                              </LocalDevelopmentModal>
                            )}
                          </ListItem>
                        </>
                      ) : (
                        <ListItem button style={{ color: '#00b400' }}>
                          <ListItemIcon sx={{ pl: { xs: 0, sm: 0 } }}>
                            <CheckIcon style={{ color: '#00b400' }} />
                          </ListItemIcon>
                          <WalletTokens>
                            <ListItemText
                              primary="WALLET CONNECTED"
                              secondary={`${principal?.toText().substring(0, 25)}...`}
                            />
                            {['OGY', 'ICP'].map((token, index) => (
                              <div key={`${token}+${index}`}>
                                <TokenIcon symbol={token} />{' '}
                                <span
                                  style={{
                                    color: 'white',
                                    marginRight: '5px',
                                    marginBottom: '-3px',
                                  }}
                                >
                                  {tokens[token]?.balance > -1 ? (
                                    tokens[token]?.balance
                                  ) : (
                                    <CircularProgress size={10} />
                                  )}
                                </span>
                              </div>
                            ))}
                          </WalletTokens>
                          {isLocal && (
                            <LocalDevelopmentModal>
                              <Link>Local Development Settings</Link>
                            </LocalDevelopmentModal>
                          )}
                        </ListItem>
                      )}
                      <Divider />
                      {initialMenuItems.map((i) => (
                        <ListItem key={i.page} onClick={() => handleNavigation(i)} button>
                          <ListItemIcon sx={{ pading: '8px' }}>{i.icon}</ListItemIcon>
                          <ListItemText primary={i.title} />
                        </ListItem>
                      ))}
                      {menuItems?.map((i) => (
                        <ListItem key={i.page} onClick={() => handleNavigation(i)} button>
                          <ListItemIcon sx={{ pading: '8px' }}>{i.icon}</ListItemIcon>
                          <ListItemText primary={i.title} />
                        </ListItem>
                      ))}
                    </List>
                    <Divider />
                    <List>
                      {loggedIn && (
                        <ListItem button>
                          <ListItemIcon sx={{ pl: { xs: 0, sm: 0 } }}>
                            <LogoutIcon />
                          </ListItemIcon>
                          <ListItemText primary="Log Out" onClick={handleLogOut} />
                        </ListItem>
                      )}
                    </List>
                    {}
                  </Box>
                </Box>
                <div
                  style={{
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'end',
                  }}
                >
                  <div style={{ paddingBottom: '25px', cursor: 'pointer' }} onClick={toggleTheme}>
                    {themeMode === 'light' ? <DarkIcon /> : <LightIcon />}
                  </div>
                </div>
              </Drawer>
            </Box>
          </Hidden>
          <Box
            sx={{
              marginTop: '50px',
              flexGrow: '1',
              padding: (theme) => theme.spacing(1),
              width: 'calc(100% - 320px)',
            }}
          >
            {children}
          </Box>
        </Box>
      </ThemeConfig>
    </>
  );
};

export type MenuItem = {
  page: string;
  title: string;
  icon: JSX.Element;
};

export type LayoutProps = {
  children: JSX.Element;
  menuItems?: MenuItem[];
};

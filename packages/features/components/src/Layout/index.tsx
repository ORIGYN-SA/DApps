import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import DarkIcon from '@mui/icons-material/Brightness4Rounded';
import LightIcon from '@mui/icons-material/Brightness7Rounded';
import CheckIcon from '@mui/icons-material/Check';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LoginIcon from '@mui/icons-material/Login';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import {
  Box,
  Divider,
  Drawer,
  Hidden,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import React, { useContext, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthContext } from '@dapp/features-authentication';
import ThemeConfig, { SiteContext } from '@dapp/features-theme';
import { useTokensContext } from '@dapp/features-tokens-provider';
import { ThemeLogo } from '../Logo';
import { WalletTokens } from '../WalletTokens';
import { TokenIcon } from '../TokenIcon';

const Items = [
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

export const Layout = ({ children }) => {
  const { onChangeMode, themeMode } = useContext(SiteContext);

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
                    <Logo />
                  </Box>
                </Box>
                <Divider />
                <Box>
                  <List>
                    {!loggedIn ? (
                      <>
                        <ListItem button onClick={() => logIn('ii')}>
                          <ListItemIcon sx={{ pl: { xs: 0, sm: 0 } }}>
                            <LoginIcon />
                          </ListItemIcon>
                          <ListItemText primary="Authenticate (Internet Identity)" />
                        </ListItem>
                        <ListItem button onClick={() => logIn('plug')}>
                          <ListItemIcon sx={{ pl: { xs: 0, sm: 0 } }}>
                            <LoginIcon />
                          </ListItemIcon>
                          <ListItemText primary="Authenticate (Plug)" />
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
                          {['OGY', 'ICP'].map((token) => (
                            <div>
                              <TokenIcon symbol={token} />{' '}
                              <span
                                style={{
                                  color: 'white',
                                  marginRight: '5px',
                                  marginBottom: '-3px',
                                }}
                              >
                                {tokens[token]?.balance}
                              </span>
                            </div>
                          ))}
                        </WalletTokens>
                      </ListItem>
                    )}
                    <Divider />
                    {/* <ListItem
                        button
                        style={{ color: "#00b400" }}
                        onClick={sendXTC}
                      >
                        <WalletTokens>
                          <ListItemText primary={"Test send function"} />
                        </WalletTokens>
                      </ListItem> */}
                    {Items.map((i) => (
                      <ListItem key={i.page} onClick={() => handleNavigation(i)} button>
                        <ListItemIcon sx={{ pading: '8px' }}>{i.icon}</ListItemIcon>
                        <ListItemText primary={i.title} />
                      </ListItem>
                    ))}
                  </List>
                  <Divider />
                  <List>
                    {loggedIn && (
                      <ListItem button onClick={logOut}>
                        <ListItemIcon sx={{ pl: { xs: 0, sm: 0 } }}>
                          <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Log Out" />
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
  );
};

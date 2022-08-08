import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined'
import { Box } from '@mui/material'
import { useContext, useEffect } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import { useAuthContext } from '@dapp/features-authentication'
import { useTokensContext } from '@dapp/features-tokens-provider'
import ThemeConfig, { SiteContext } from '@dapp/features-theme'
import ResponsiveAppBar from './Layout/AppBarr'

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
]

const Layout = ({ children }) => {
  const { onChangeMode, themeMode } = useContext(SiteContext)

  const { logIn, loggedIn, principal, logOut } = useAuthContext()
  const { tokens, refreshAllBalances } = useTokensContext()
  const toggleTheme = () => {
    let t = themeMode === 'light' ? 'dark' : 'light'
    onChangeMode(t)
  }
  const handleNavigation = (i) => {
    window.location.href =
      window.location.href.substr(
        0,
        window.location.href.lastIndexOf('\\') + 1
      ) + i.page
  }

  useEffect(() => {
    if (!tokens['OGY'].balance) {
      refreshAllBalances()
    }
  }, [tokens])
  return (
    <>
      <ThemeConfig>
        <ResponsiveAppBar />
        {/*<Box*/}
        {/*  sx={{*/}
        {/*    display: "flex",*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <Hidden lgDown>*/}
        {/*    <Box width="320px" bgcolor="red">*/}
        {/*      <Drawer variant="permanent" open={true}>*/}
        {/*        <Box width="320px">*/}
        {/*          <Box*/}
        {/*            style={{*/}
        {/*              display: "flex",*/}
        {/*              flexDirection: "column",*/}
        {/*              padding: "1rem 2rem",*/}
        {/*            }}*/}
        {/*          >*/}
        {/*            <Box sx={{ padding: "8px" }}>*/}
        {/*              <Logo />*/}
        {/*            </Box>*/}
        {/*          </Box>*/}
        {/*          <Divider />*/}
        {/*          <Box>*/}
        {/*            <List>*/}
        {/*              {!loggedIn ? (*/}
        {/*                <>*/}
        {/*                  <ListItem button onClick={() => logIn("ii")}>*/}
        {/*                    <ListItemIcon sx={{ pl: { xs: 0, sm: 0 } }}>*/}
        {/*                      <LoginIcon />*/}
        {/*                    </ListItemIcon>*/}
        {/*                    <ListItemText primary={"CONNECT WALLET (II)"} />*/}
        {/*                  </ListItem>*/}
        {/*                  <ListItem button onClick={() => logIn("plug")}>*/}
        {/*                    <ListItemIcon sx={{ pl: { xs: 0, sm: 0 } }}>*/}
        {/*                      <LoginIcon />*/}
        {/*                    </ListItemIcon>*/}
        {/*                    <ListItemText primary={"CONNECT WALLET (plug)"} />*/}
        {/*                  </ListItem>*/}
        {/*                </>*/}
        {/*              ) : (*/}
        {/*                <ListItem button style={{ color: "#00b400" }}>*/}
        {/*                  <ListItemIcon sx={{ pl: { xs: 0, sm: 0 } }}>*/}
        {/*                    <CheckIcon style={{ color: "#00b400" }} />*/}
        {/*                  </ListItemIcon>*/}
        {/*                  <ListItemText*/}
        {/*                    primary={"WALLET CONNECTED"}*/}
        {/*                    secondary={*/}
        {/*                      principal?.toText().substring(0, 25) + "..."*/}
        {/*                    }*/}
        {/*                  />*/}
        {/*                </ListItem>*/}
        {/*              )}*/}
        {/*              <Divider />*/}

        {/*              {Items.map((i) => (*/}
        {/*                <ListItem*/}
        {/*                  key={i.page}*/}
        {/*                  onClick={() => handleNavigation(i)}*/}
        {/*                  button*/}
        {/*                >*/}
        {/*                  <ListItemIcon sx={{ pading: "8px" }}>*/}
        {/*                    {i.icon}*/}
        {/*                  </ListItemIcon>*/}
        {/*                  <ListItemText primary={i.title} />*/}
        {/*                </ListItem>*/}
        {/*              ))}*/}
        {/*            </List>*/}
        {/*            <Divider />*/}
        {/*            <List>*/}
        {/*              <ListItem button onClick={toggleTheme}>*/}
        {/*                <ListItemIcon sx={{ pl: { xs: 0, sm: 0 } }}>*/}
        {/*                  {themeMode === "light" ? <DarkIcon /> : <LightIcon />}*/}
        {/*                </ListItemIcon>*/}
        {/*                <ListItemText primary={"THEME"} />*/}
        {/*              </ListItem>*/}
        {/*            </List>*/}
        {/*            {}*/}
        {/*          </Box>*/}
        {/*        </Box>*/}
        {/*      </Drawer>*/}
        {/*    </Box>*/}
        {/*  </Hidden>*/}
        <Box
          sx={{
            flexGrow: '1',
          }}
        >
          {children}
        </Box>
        {/*</Box>*/}
      </ThemeConfig>
    </>
  )
}

export default Layout

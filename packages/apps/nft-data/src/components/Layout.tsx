import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import DarkIcon from "@mui/icons-material/Brightness4Rounded";
import LightIcon from "@mui/icons-material/Brightness7Rounded";
import CheckIcon from "@mui/icons-material/Check";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LoginIcon from "@mui/icons-material/Login";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import {
  Box,
  Divider,
  Drawer,
  Hidden,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React, { useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import {ThemeLogo} from '@dapp/features-components';
import { useAuthContext } from '@dapp/features-authentication';
import ThemeConfig, { SiteContext } from "@dapp/features-theme";

const Items = [
  {
    page: "ledger",
    title: "Ledger",
    icon: <ListAltOutlinedIcon />,
  },
  {
    page: "data",
    title: "NFT info",
    icon: <InfoOutlinedIcon />,
  },
  {
    page: "wallet",
    title: "Wallet",
    icon: <AccountBalanceWalletOutlinedIcon />,
  },
];

const Layout = ({ children }) => {
  const { onChangeMode, themeMode } = useContext(SiteContext);

  const { logIn, loggedIn, principal } = useAuthContext();
  const toggleTheme = () => {
    let t = themeMode === "light" ? "dark" : "light";
    onChangeMode(t);
  };

  const handleNavigation = (i) => {
    window.location.href =
      window.location.href.substr(
        0,
        window.location.href.lastIndexOf("\\") + 1
      ) + i.page;
  };

  return (
    <>
      <ThemeConfig>
        <Box
          sx={{
            display: "flex",
          }}
        >
          <Hidden lgDown>
            <Box width="320px" bgcolor="red">
              <Drawer variant="permanent" open={true}>
                <Box width="320px">
                  <Box
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      padding: "1rem 2rem",
                    }}
                  >
                    <Box sx={{ padding: "8px" }}>
                      <ThemeLogo />
                    </Box>
                  </Box>
                  <Divider />
                  <Box>
                    <List>
                      {!loggedIn ? (
                        <>
                          <ListItem button onClick={() => logIn("ii")}>
                            <ListItemIcon sx={{ pl: { xs: 0, sm: 0 } }}>
                              <LoginIcon />
                            </ListItemIcon>
                            <ListItemText primary={"CONNECT WALLET (II)"} />
                          </ListItem>
                          <ListItem button onClick={() => logIn("plug")}>
                            <ListItemIcon sx={{ pl: { xs: 0, sm: 0 } }}>
                              <LoginIcon />
                            </ListItemIcon>
                            <ListItemText primary={"CONNECT WALLET (plug)"} />
                          </ListItem>
                        </>
                      ) : (
                        <ListItem button style={{ color: "#00b400" }}>
                          <ListItemIcon sx={{ pl: { xs: 0, sm: 0 } }}>
                            <CheckIcon style={{ color: "#00b400" }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={"WALLET CONNECTED"}
                            secondary={
                              principal?.toText().substring(0, 25) + "..."
                            }
                          />
                        </ListItem>
                      )}
                      <Divider />

                      {Items.map((i) => (
                        <ListItem
                          key={i.page}
                          onClick={() => handleNavigation(i)}
                          button
                        >
                          <ListItemIcon sx={{ pading: "8px" }}>
                            {i.icon}
                          </ListItemIcon>
                          <ListItemText primary={i.title} />
                        </ListItem>
                      ))}
                    </List>
                    <Divider />
                    <List>
                      <ListItem button onClick={toggleTheme}>
                        <ListItemIcon sx={{ pl: { xs: 0, sm: 0 } }}>
                          {themeMode === "light" ? <DarkIcon /> : <LightIcon />}
                        </ListItemIcon>
                        <ListItemText primary={"THEME"} />
                      </ListItem>
                    </List>
                    {}
                  </Box>
                </Box>
              </Drawer>
            </Box>
          </Hidden>
          <Box
            sx={{
              marginTop: "50px",
              flexGrow: "1",
              padding: (theme) => theme.spacing(1),
              width: "calc(100% - 320px)",
            }}
          >
            {children}
          </Box>
        </Box>
      </ThemeConfig>
    </>
  );
};

export default Layout;

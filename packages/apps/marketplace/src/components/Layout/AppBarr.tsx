import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { AuthContext } from '@dapp/features-authentication';
import { useTokensContext } from '@dapp/features-tokens-provider';
import { OrigynLogo as Logo } from '@dapp/common-assets';
import { TokenIcon, WalletTokens } from '@dapp/features-components';

const ResponsiveAppBar = () => {
  const { logIn, loggedIn, logOut } = React.useContext(AuthContext);
  const { tokens } = useTokensContext();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Logo sx={{ height: 40 }} />
          {!loggedIn ? (
            <>
              <p onClick={handleOpenUserMenu}>Connect Wallet</p>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem
                  onClick={() => {
                    logIn('plug');
                    handleCloseUserMenu();
                  }}
                >
                  <Typography textAlign="center">Plug</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    logIn('ii');
                    handleCloseUserMenu();
                  }}
                >
                  <Typography textAlign="center">Internet Identity</Typography>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <div style={{ display: 'flex' }}>
              <WalletTokens>
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
              <Box>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="A" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={logOut}>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            </div>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;

import React from 'react';
import { Box } from '@mui/material';
import { useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { useTokensContext } from '@dapp/features-tokens-provider';
import ThemeConfig from '@dapp/features-theme';
import ResponsiveAppBar from './Layout/AppBarr';

const Layout = ({ children }: any) => {

  const { tokens, refreshAllBalances } = useTokensContext();

  useEffect(() => {
    if (tokens.OGY.balance === -1) {
      refreshAllBalances();
    }
  }, [tokens]);
  return (
    <ThemeConfig>
      <ResponsiveAppBar />
      <Box
        sx={{
          flexGrow: '1',
        }}
      >
        {children}
      </Box>
    </ThemeConfig>
  );
};

export default Layout;

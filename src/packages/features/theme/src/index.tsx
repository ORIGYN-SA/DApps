import React, { createContext, useContext, useMemo } from 'react';
import { CssBaseline } from '@mui/material';
import {
  createTheme,
  responsiveFontSizes,
  StyledEngineProvider,
} from '@mui/material/styles';
import { useLocalStorage } from '@dapp/utils';
import palette from './palette';
import { ThemeProvider } from 'styled-components';


const initialState = {
  themeMode: 'dark',
  drawerMode: false,
};

export const SiteContext = createContext(initialState);

export const SiteProvider = ({ children }: any) => {
  const [site, setSite] = useLocalStorage('site', {
    themeMode: initialState.themeMode,
  });

  const onChangeMode = (t) => {
    setSite({
      ...site,
      themeMode: t,
      drawerMode: false,
    });
  };
  const onDrawerMode = (d) => {
    setSite({
      ...site,
      drawerMode: d,
    });
  };

  return (
    <SiteContext.Provider
      value={{
        ...site,
        onChangeMode,
        onDrawerMode,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export default function ThemeConfig({ children }: any) {
  const { themeMode } = useContext(SiteContext);
  const isLight = themeMode === 'light';

  const themeOptions: any = useMemo(
    () => ({
      palette: isLight
        ? { ...palette.light, mode: 'light' }
        : { ...palette.dark, mode: 'dark' },
      shape: {
        borderRadius: 8,
        borderRadiusSm: 12,
        borderRadiusMd: 16,
      },
      // Overrides
      components: {
        MuiPaper: {
          defaultProps: {
            elevation: 0,
          },
          styleOverrides: {
            root: {
              backgroundImage: 'none',
            },
          },
        },
      },
    }),
    [isLight],
  );

  let theme = createTheme(themeOptions);
  theme = responsiveFontSizes(theme);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

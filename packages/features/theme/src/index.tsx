import React, { createContext, useContext } from 'react';
import { useMemo } from 'react';
import { CssBaseline } from '@mui/material';
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
  StyledEngineProvider,
} from '@mui/material/styles';
import { useLocalStorage } from '@dapp/utils';
import palette from './palette';

const initialState = {
  themeMode: 'dark',
  drawerMode: false,
  onChangeMode: (t) => {},
  onDrawerMode: (d) => {},
};

export const SiteContext = createContext(initialState);

export const SiteProvider = ({ children }) => {
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
  console.log(site);
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

export default function ThemeConfig({ children }) {
  const { themeMode } = useContext(SiteContext);
  console.log('themeMode', themeMode);
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

import React from "react";
import { ThemeProvider } from "styled-components";


const theme = {
    colors: {
      PURE_BLACK: '#000000',
      BLACK: '#151515',
      WHITE: '#FFFFFF',
      ACCENT_COLOR: '#F5A506',
      LIGHT_GRAY: '#DFDFDF',
      LIGHTER_GRAY: '#F2F2F2',
      BG_GRAY: '#E5E5E5',
      BLACK_DARK: '#242424',
      SECONDARY_TEXT:'#5F5F5F',
      INACTIVE_BG: '#E3E3E3',
      BG: 'E3E3E3',
      BG_TEXT: '#FEFEFE',
      GRAY: '#9A9A9A',
      DARK_GRAY:'#6F6F6F'
    },
    font: {
      FONT_FAMILY_1: 'Montserrat'
  
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

  const Theme = ({ children }) => (
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  );
  
  export default Theme;
  
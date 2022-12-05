import { grey, blueGrey } from '@mui/material/colors';

const COMMON = {
  common: { black: '#000', white: '#fff' },
};

const palette = {
  light: {
    ...COMMON,
    primary: {
      main: '#49a540',
      contrast: '#fff',
    },
    secondary: {
      main: '#177bba',
      contrast: '#fff',
    },
    neutral: {
      main: '#fff',
      contrast: blueGrey[700],
    },
    text: {
      primary: blueGrey[700],
      secondary: blueGrey[400],
      disabled: grey.A200,
      hint: grey.A200,
    },
    background: {
      paper: '#151515',
      default: '#151515',
    },
    donut: {
      bg: '#d2d3d4',
    },
    cellBorder: {
      color: 'rgba(113, 135, 146, 1)',
    },
  },
  dark: {
    ...COMMON,
    primary: {
      main: '#white',
      contrast: '#fff',
    },
    secondary: {
      main: '#000000',
      contrast: '#fff',
    },
    neutral: {
      main: '#fff',
      contrast: blueGrey[700],
    },
    text: {
      primary: blueGrey[300],
      secondary: blueGrey[100],
      disabled: grey.A200,
      hint: grey.A200,
    },
    background: {
      paper: '#000000',
      default: '#151515',
    },
    donut: {
      bg: '#383b4c',
    },
    cellBorder: {
      color: '#242424',
    },
  },
};

export default palette;

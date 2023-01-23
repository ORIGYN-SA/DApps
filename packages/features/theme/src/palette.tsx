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
      paper: '#fff',
      default: '#fafafa',
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
      primary: blueGrey[300],
      secondary: blueGrey[100],
      disabled: grey.A200,
      hint: grey.A200,
    },
    background: {
      paper: '#222639',
      default: '#1B1E2E',
    },
    donut: {
      bg: '#383b4c',
    },
    cellBorder: {
      color: 'rgba(255, 255, 255, 0.54)',
    },
  },
};

// const figmaPalette = {
//   light: {
//     primary: {
//       background: '#FEFEFE',
//       border: '#E3E3E3',
//       secondary: '#5F5F5F',
//       inactive: '#9A9A9A',
//       text: '#151515'
//     },
//     origyn_gold: {
//       primary: '#EE9907'
//     },
//     origyn_purple: {
//       primary: '#70237D',
//       hover: '#2B0B31',
//       pressed: '#43154A'
//     },
//     origyn_turquoise: {
//       primary: '#43B8CA'
//     },
//     origyn_green: {
//       primary: '#5EAC31'
//     },
//     origyn_red: {
//       primary: 'DD1422',
//       error: 'B5010A'
//     },
//   },
//   dark: {
//     primary: {
//       background: '#151515',
//       border: '#242424',
//       secondary: '#5F5F5F',
//       inactive: '#9A9A9A',
//       text: '#FEFEFE'
//     },
//     origyn_gold: {
//       primary: '#EE9907'
//     },
//     origyn_purple: {
//       primary: '#70237D',
//       hover: '#2B0B31',
//       pressed: '#43154A'
//     },
//     origyn_turquoise: {
//       primary: '#43B8CA'
//     },
//     origyn_green: {
//       primary: '#5EAC31'
//     },
//     origyn_red: {
//       primary: 'DD1422',
//       error: 'B5010A'
//     },
//   }
// };

export default palette;

import MuiListItemButton from '@mui/material/ListItemButton';
import { makeStyles } from 'tss-react/mui';
export const Sizes = {
    maxHeight: 400,
    minHeight: 400,
    minWidth: 200,
  };

  export const useStyles = makeStyles()(() => {
    return{
    horizontal: {
      display: 'flex',
      flexDirection: 'row',
      padding: 0,
    },
    vertical: {
      flexDirection: 'column',
      padding: 0,
    },
    noPadding: {
      padding: 0,
    },
    styledScroll: {
      overflow: 'scroll',
      '&::-webkit-scrollbar': {
        width: '0.4em',
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: 'transparent',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#9a9a9a',
        borderRadius: '5px',
      },
    }
  }
  });
  

export  const ListItemButton = (MuiListItemButton);
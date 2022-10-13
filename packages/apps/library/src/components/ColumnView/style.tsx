import React from "react";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import MuiListItemButton from '@mui/material/ListItemButton';

export const useStyles = makeStyles(() => ({
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
    },
  }));
  
export const Sizes = {
    maxHeight: 400,
    minHeight: 400,
    minWidth: 300,
  };
  
export  const ListItemButton = withStyles({
    root: {
      '&.Mui-selected, &.Mui-selected:hover': {
        backgroundColor: '#151515',
        color: '#ffffff',
      },
      '&$selected, &$selected:hover': {
        backgroundColor: '#151515',
        color: '#ffffff',
      },
    },
  })(MuiListItemButton);
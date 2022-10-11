import React, { useContext, useEffect, useState } from 'react';
import { AuthContext, getTokenId, getCanisterId } from '@dapp/features-authentication';
import Grid from '@mui/material/Grid';
import NFTLibrary from '../NFTLibrary';
import { getNftCollection, getNft, OrigynClient } from '@origyn-sa/mintjs';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import Collapse from '@mui/material/Collapse';
import Paper from '@mui/material/Paper';
import MuiListItemButton from '@mui/material/ListItemButton';
import { Box } from '@mui/system';
import LibraryBox from '../LibraryBox';

export const StageLibraryForm = () => {
    return (
        <Box
        component={Paper}
        elevation={2}
        sx={{ margin: 2, width: '100%', padding: 2 }}
      >
        <div>
            Stage Library Form Available - Logged In
        </div>
      </Box>
    );
}

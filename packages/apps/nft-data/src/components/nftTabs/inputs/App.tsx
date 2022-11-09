import React, { useEffect, useState, useContext } from 'react';
import { getNft, getNftCollectionMeta, OrigynClient } from '@origyn-sa/mintjs';
import { getTokenId, getCanisterId } from '@dapp/features-authentication';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Grid, TextField, Button, Box, Divider, Select, SelectChangeEvent } from '@mui/material';
import pick from 'lodash/pick';
import { Principal } from '@dfinity/principal';
import { NFTUpdateRequest, UpdateRequest, CandyValue } from '../types/origyn_nft_reference.did';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
// Context
import { MetadataContext } from '../context';

const App = (props: any) => {

  const { setMetatype,app_id } = useContext(MetadataContext);

  const handleChange = (event) => {
    setMetatype(props.item.name,event.target.value);
    console.log('app_id',app_id);
  };

  useEffect(() => {
    setMetatype(props.item.name,props.item.value);

  }, []);

  return (
    <TextField
      id="outlined-basic"
      label={'Change ' + props.item.name}
      variant="standard"
      sx={{ marginBottom: 1 }}
      onChange={handleChange}
    />
  );
};

export default App;

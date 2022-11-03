import React, { useEffect, useState, useContext } from 'react';
import { AuthContext, getTokenId, getCanisterId } from '@dapp/features-authentication';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Grid, TextField, Button, Box, Divider, Select } from '@mui/material';
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


const Asset = (props) => {
    return (
        <Select>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
        </Select>
    )
}

const App = (props) => {
    return (
        <TextField id="outlined-basic" label="App" variant="outlined"/>
    )
    
}

const Permission = (props) => {
    return (
        <TextField id="outlined-basic" label="Permission" variant="outlined"/>
    )
}

export const Input = {
    "Asset" : <Asset />,
    "App" : <App />,
    "Permission" : <Permission />
}
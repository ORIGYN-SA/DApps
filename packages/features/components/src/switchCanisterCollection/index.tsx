import React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import { Box, Button } from '@mui/material';
import { checkCanister } from '@dapp/utils';
export const SwitchCanisterCollection = () => {
   
    const [switchTo, setSwitchTo] = React.useState('');
    const handleChange = event => {
        setSwitchTo(event.target.value);
    };
    
    const changeCanisterCollection = async () => {
       let response : string | boolean = await checkCanister(switchTo);
         if(response === false){
                alert('Canister not found');
         }
    }
    return (

        <Box
            component={Paper}
            elevation={3}
            sx={{ margin: 2, width: '100%', padding: 2, textAlign: 'center' }}
        >
            <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%' }}
            >
                <IconButton sx={{ p: '10px' }} aria-label="menu">
                    <ChangeCircleIcon />
                </IconButton>
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Switch Canister"
                    inputProps={{ 'aria-label': 'Switch Canister' }}
                    value={switchTo}
                    onChange={handleChange}
                />
                <Button variant="text"
                    onClick={changeCanisterCollection}
                >CHANGE</Button>
            </Paper>
        </Box>

    );
}
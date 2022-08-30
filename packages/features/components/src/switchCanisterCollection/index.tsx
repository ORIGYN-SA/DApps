import React from 'react';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import { Box, Button } from '@mui/material';
import { checkCanister } from '@dapp/utils';
import { getCanisterId } from '@dapp/features-authentication';
import InputAdornment from '@mui/material/InputAdornment';
import { toast } from 'react-toastify';

export const SwitchCanisterCollection = () => {
    const [switchTo, setSwitchTo] = React.useState('');
    const handleChange = event => {
        setSwitchTo(event.target.value);
    };
    const [errorText, setErrorText] = React.useState('');
    const changeCanisterCollection = async () => {
        const response: string | boolean = await checkCanister(switchTo.toLowerCase().trim());
        const currentCanisterId = await getCanisterId();
        if (response === false) {
            setErrorText('Canister not found');
        } else {
            const url = window.location.href;
            const new_url = url.replace(currentCanisterId, response.toString());
            window.location.href = new_url;
            setErrorText('');
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
                <TextField
                    id="outlined-basic"
                    label="Switch Canister"
                    variant="outlined"
                    helperText={errorText}
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Switch Canister"
                    inputProps={{ 'aria-label': 'Switch Canister' }}
                    value={switchTo}
                    onChange={handleChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <ChangeCircleIcon />
                            </InputAdornment>
                        )
                    }} />
                <Button variant="text"
                    onClick={changeCanisterCollection}
                >SWITCH</Button>
            </Paper>
        </Box>

    );
}

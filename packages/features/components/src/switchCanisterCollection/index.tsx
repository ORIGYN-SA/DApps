import React from 'react';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import { Box, Button, Typography } from '@mui/material';
import { checkCanister } from '@dapp/utils';
import { getCanisterId } from '@dapp/features-authentication';
import InputAdornment from '@mui/material/InputAdornment';
import { useSnackbar } from 'notistack';
import { Principal } from '@dfinity/principal';
import { Actor, HttpAgent } from '@dfinity/agent';
import { phonebookIdl } from '@dapp/common-candid';

export const SwitchCanisterCollection = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [switchTo, setSwitchTo] = React.useState('');
    const handleChange = (event) => {
        setSwitchTo(event.target.value);
    };
    // Phonebook Agent
    const agent = new HttpAgent({
        host: 'https://boundary.ic0.app/',
    });
    // Phonebook actor for the current canister name 
    const phonebook_actor = Actor.createActor(phonebookIdl, {
        agent: agent,
        canisterId: 'ngrpb-5qaaa-aaaaj-adz7a-cai',
    });
    const changeCanisterCollection = async () => {
        //Transform current url to a string
        const url = window.location.href.toString();
        // Get the checked canister
        const NewCheckedCanister: string | boolean = await checkCanister(switchTo.toLowerCase().trim());
        // Get the current canisterId from authentification
        const CurrentCanisterId = await getCanisterId();
        console.log(CurrentCanisterId);
        // Get the name of the current canister from the phonebook using reverse_lookup
        const CurrentCanisterName: any = await phonebook_actor?.reverse_lookup(
            Principal.fromText(CurrentCanisterId),
        );
        if (NewCheckedCanister === false) {
            // Display error message - SNACKBAR
            enqueueSnackbar('Canister not found', {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                },
            });
        } else {
            const NewCanisterName = await phonebook_actor?.reverse_lookup(
                Principal.fromText(NewCheckedCanister.toString()),
            );
            let NewCanister = "";
            if (NewCanisterName == "") {
                NewCanister = NewCheckedCanister.toString();
            } else {
                NewCanister = NewCanisterName.toString();
            };

            let new_url = '';
            if (CurrentCanisterName == "") {
                new_url = url.replace(CurrentCanisterId, NewCanister);
            } else {
                // Search for the canister Name in the url
                const found = url.includes(CurrentCanisterName);
                // If found, replace it with the new canister name, if not replace with the new canister string 
                if (found === true) {
                    new_url = url.replace(CurrentCanisterName, NewCanister);
                } else {
                    new_url = url.replace(CurrentCanisterId, NewCanister);
                }
            }
            // Set the new url
            document.location.href = new_url;
            // Display a success message - SNACKBAR
            enqueueSnackbar('Switching Canister...', {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                },
            });
        }
    };

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
                    data-testid="switch-canister-textfield"
                    id="outlined-basic"
                    label="Switch Canister"
                    variant="outlined"
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
                        ),
                    }}
                />
                <Button
                    data-testid="switch-canister-button"
                    variant="text"
                    onClick={changeCanisterCollection}
                >
                    SWITCH
                </Button>

            </Paper>
        </Box>
    );
};

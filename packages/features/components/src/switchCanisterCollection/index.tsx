import React, { useEffect } from 'react';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import { Box, Button, Typography, Grid, Switch } from '@mui/material';
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
    const [CurrentCanisterName, setCurrentCanisterName] = React.useState('');
    const [CurrentCanisterId, SetCurrentCanisterId] = React.useState('');

    const getTypedValue = (event) => {
        setSwitchTo(event.target.value);
    };

    const GetCanisterName = async () => {
        const canisterId = await getCanisterId();
        const QueryName : any = await phonebookActor?.reverse_lookup(
            Principal.fromText(canisterId),
        );
        if(QueryName=="" || QueryName==null){
            setCurrentCanisterName("Unknown");
        }else{
            setCurrentCanisterName(QueryName);
        }
    };
    // Phonebook Agent
    const agent = new HttpAgent({
        host: 'https://boundary.ic0.app/',
    });
    // Phonebook actor for the current canister name 
    const phonebookActor = Actor.createActor(phonebookIdl, {
        agent: agent,
        canisterId: 'ngrpb-5qaaa-aaaaj-adz7a-cai',
    });
    const GetCurrentCanisterId = async () => {
        SetCurrentCanisterId(await getCanisterId());
    };
    const changeCanisterCollection = async () => {
        //Transform current url to a string
        const currentUrl = window.location.href.toString();
        // Get the checked canister
        const NewCheckedCanister: string | boolean = await checkCanister(switchTo.toLowerCase().trim());
        // Get the name of the current canister from the phonebook using reverse_lookup
        const CurrentCanisterName: any = await phonebookActor?.reverse_lookup(
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
            const NewCanisterName = await phonebookActor?.reverse_lookup(
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
                new_url = currentUrl.replace(CurrentCanisterId, NewCanister);
            } else {
                // Search for the canister Name in the url
                const found = currentUrl.includes(CurrentCanisterName);
                // If found, replace it with the new canister name, if not replace with the new canister string 
                if (found === true) {
                    new_url = currentUrl.replace(CurrentCanisterName, NewCanister);
                } else {
                    new_url = currentUrl.replace(CurrentCanisterId, NewCanister);
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
    useEffect(() => {
        GetCurrentCanisterId();
        GetCanisterName();
    }, [Actor]);

    return (
        <Box
            component={Paper}
            elevation={3}
            sx={{ margin: 2, width: '100%', padding: 2 }}
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
                    onChange={getTypedValue}
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
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Typography sx={{ m: 2, fontSize: 13 }}>
                        Current Canister String: <b>{CurrentCanisterId}</b>
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography sx={{ m: 2, fontSize: 13 }}>
                        Canister Name: <b>{CurrentCanisterName}</b>
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
};

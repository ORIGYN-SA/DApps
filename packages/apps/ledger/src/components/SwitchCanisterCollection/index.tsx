import React, { useEffect, useContext } from 'react';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import { Box, Button, Typography, Grid } from '@mui/material';
import { validateCanisterOrCollectionId } from '@dapp/utils';
import InputAdornment from '@mui/material/InputAdornment';
import { useSnackbar } from 'notistack';
import { Actor } from '@dfinity/agent';
import { PerpetualOSContext } from '@dapp/features-context-provider';
import { lookupCollectionId } from '@origyn/perpetualos-context';

export const SwitchCanisterCollection = () => {
  const context = useContext(PerpetualOSContext);
  const { enqueueSnackbar } = useSnackbar();
  const [switchTo, setSwitchTo] = React.useState('');
  const [currentCanisterName, setCurrentCanisterName] = React.useState('');
  const [currentCanisterId, setCurrentCanisterId] = React.useState('');

  const getTypedValue = (event) => {
    setSwitchTo(event.target.value);
  };

  const getCanisterName = async () => {
    setCurrentCanisterName(context.collectionId ?? 'Unknown');
  };

  const getCurrentCanisterId = async () => {
    setCurrentCanisterId(context.canisterId);
  };

  const changeCanisterCollection = async () => {
    // Get the checked canister
    const newCanisterId = await validateCanisterOrCollectionId(
      switchTo.toLowerCase().trim(),
      !context.isLocal,
    );

    if (!newCanisterId) {
      // Display error message - SNACKBAR
      enqueueSnackbar('Canister not found', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
    } else {
      let newCollectionId = await lookupCollectionId(newCanisterId.toString());

      // redirect to new canister
      document.location.href = window.location.href.replace(
        context.collectionId ?? context.canisterId,
        newCollectionId ?? newCanisterId,
      );

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
    getCurrentCanisterId();
    getCanisterName();
  }, [Actor]);

  return (
    <Box component={Paper} elevation={3} sx={{ margin: 2, width: '100%', padding: 2 }}>
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
            Current Canister String: <b>{currentCanisterId}</b>
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography sx={{ m: 2, fontSize: 13 }}>
            Canister Name: <b>{currentCanisterName}</b>
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

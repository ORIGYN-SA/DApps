import React, { Fragment, useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  List,
  ListItem,
  Checkbox,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useTokensContext, Token } from '@dapp/features-tokens-provider';
import { IdlStandard } from '@dapp/utils';
import { useAuthContext } from '@dapp/features-authentication';
import { TabPanel } from '../TabPanel';
import { TokenIcon } from '../TokenIcon';
import { LoadingContainer } from '../LoadingContainer';

export const WalletTokens = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [selectedStandard, setSelectedStandard] = useState<string>(
    IdlStandard.DIP20.toString(),
  );
  const [inputCanisterId, setInputCanisterId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { tokens, addToken, toggleToken, refreshAllBalances } = useTokensContext();
  const { enqueueSnackbar } = useSnackbar();
  const { principal } = useAuthContext();
  const handleAddButton = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const tokenResponse = await addToken(
      inputCanisterId,
      IdlStandard[selectedStandard],
    );
    if (typeof tokenResponse !== 'string') {
      enqueueSnackbar(
        `You have successfully added token ${tokenResponse.symbol}.`,
        {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        },
      );
    } else {
      enqueueSnackbar(tokenResponse, {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
    }
    setIsLoading(false);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
    refreshAllBalances();
  };
  const handleTabChange = (event: React.SyntheticEvent, tab: number) => {
    setSelectedTab(tab);
  };
  const onTokenCheck = (symbol: string) => {
    toggleToken(symbol);
  };
  const a11yProps = (index: number) => ({
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  });
  return (
    <>
      <Dialog
        open={isModalOpen}
        onClose={() => handleModalClose()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Add Tokens</DialogTitle>
        <DialogContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              aria-label="basic tabs example"
            >
              <Tab label="Current Tokens" {...a11yProps(0)} />
              <Tab label="Custom Token" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <TabPanel value={selectedTab} index={0} padding={1}>
            <List dense disablePadding>
              {Object.keys(tokens).map((key: string) => {
                const token = tokens[key];
                const labelId = `checkbox-list-secondary-label-${token.symbol}`;
                return (
                  <ListItem
                    key={`${token.symbol}-${token.enabled}`}
                    secondaryAction={(
                      <Checkbox
                        edge="end"
                        onChange={() => onTokenCheck(token.symbol)}
                        checked={token.enabled}
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    )}
                    disablePadding
                  >
                    <ListItemButton>
                      <TokenIcon symbol={token.icon} />
                      <ListItemText
                        id={labelId}
                        style={{ marginLeft: '5px' }}
                        primary={token.symbol}
                      />
                      {token.balance}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </TabPanel>
          <TabPanel value={selectedTab} index={1}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '1.5rem',
                opacity: isLoading ? '0.4' : '1',
              }}
            >
              <TextField
                style={{ width: '100%' }}
                id="standard-helperText"
                label="Canister Id"
                helperText="The canister id of the ledger"
                value={inputCanisterId}
                onChange={(e) => setInputCanisterId(e.target.value)}
                required
              />
              <TextField
                style={{ width: '100%' }}
                id="standard-select-currency-native"
                select
                label="Token Standard"
                value={selectedStandard}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setSelectedStandard(event.target.value);
                }}
                SelectProps={{
                  native: true,
                }}
                helperText="Select the standard of the token"
              >
                {Object.keys(IdlStandard)
                  .filter((standard) => isNaN(parseInt(standard)))
                  .map((standard) => (
                    <option key={standard} value={standard}>
                      {standard}
                    </option>
                  ))}
              </TextField>
              <br />
              <Button variant="contained" onClick={handleAddButton}>
                Add token
              </Button>
            </div>
          </TabPanel>
          {isLoading && (
            <div style={{ marginTop: 5 }}>
              <LoadingContainer />
            </div>
          )}
        </DialogContent>
      </Dialog>
      <div onClick={handleModalOpen}>{children}</div>
    </>
  );
};

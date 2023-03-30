import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  List,
  ListItem,
  Checkbox,
  ListItemButton,
  ListItemText,
  FormControlLabel,
  Button,
} from '@mui/material';
import { useTokensContext } from '@dapp/features-tokens-provider';
import { TokenIcon } from '../TokenIcon';
import { useSessionContext } from '@dapp/features-authentication';

export const LocalDevelopmentModal = ({ children }: any) => {
  const { tokens: walletTokens, setLocalCanisterId } = useTokensContext();
  const initialCanisterIds = { ...walletTokens } as any;
  Object.keys(initialCanisterIds).forEach(
    (symbol) => (initialCanisterIds[symbol] = initialCanisterIds[symbol].localCanisterId ?? ''),
  );

  const { localDevelopment, setLocalDevelopment } = useSessionContext();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [localCanisters, setLocalCanisters] = useState(initialCanisterIds);

  const updateLocalCanister = (symbol: string, canisterId: string) => {
    setLocalCanisters((p) => {
      p[symbol] = canisterId;
      return { ...p };
    });
  };
  const handleSave = () => {
    Object.keys(localCanisters).forEach((symbol) =>
      setLocalCanisterId(symbol, localCanisters[symbol]),
    );
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };
  return (
    <>
      <Dialog
        open={isModalOpen}
        onClose={() => handleModalClose()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Local Development Settings</DialogTitle>
        <DialogContent style={{ width: '500px' }}>
          <List disablePadding>
            {Object.keys(walletTokens).map((key: string) => {
              const token = walletTokens[key];
              const labelId = `checkbox-list-secondary-label-${token.symbol}`;
              return (
                <ListItem key={`${token.symbol}-${token.enabled}`} disablePadding>
                  <ListItemButton>
                    <TokenIcon symbol={token.icon} />
                    <ListItemText
                      id={labelId}
                      style={{ marginLeft: '5px' }}
                      primary={token.symbol}
                    />
                    <TextField
                      label="Local Caniser ID"
                      variant="outlined"
                      value={localCanisters[token.symbol]}
                      onChange={(e) => updateLocalCanister(token.symbol, e.target.value)}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>

          <FormControlLabel
            control={
              <Checkbox
                checked={localDevelopment}
                onChange={(e) => setLocalDevelopment(e.target.checked)}
              />
            }
            label="Use Local Network (http://localhost:8000)"
          />

          <Button onClick={handleSave}>Save</Button>
        </DialogContent>
      </Dialog>
      <div onClick={handleModalOpen}>{children}</div>
    </>
  );
};

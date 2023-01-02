import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Button, Container, Flex, TextInput } from '@origyn-sa/origyn-art-ui';

export const GuestContainer = ({ onLogin }) => {
  const [token, setToken] = useState('');

  return (
    <Box
      component="main"
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexGrow: 1,
        minHeight: '100%',
      }}
    >
      <Container size="sm" align="center">
        <TextInput label="Login" />
        <TextInput
          label="Password"
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <br />
        <Flex fullWidth justify="center">
          <Button variant="contained" onClick={() => onLogin(token)}>
            Connect wallet
          </Button>
        </Flex>
      </Container>
    </Box>
  );
};

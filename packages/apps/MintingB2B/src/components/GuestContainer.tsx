import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Button, Container, Flex, TextInput } from '@origyn-sa/origyn-art-ui';
import { LoadingContainer } from '@dapp/features-components';

export const GuestContainer = ({ onLogin, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
      {
        isLoading ? (
          <>
            <LoadingContainer />
          </>
        ) : (
          <Container size="sm" align="center">
            <TextInput
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <Flex fullWidth justify="center">
              <Button variant="contained" onClick={() => onLogin(email, password)}>
                Log In
              </Button>
            </Flex>
          </Container>
        )
      }
    </Box>
  );
};

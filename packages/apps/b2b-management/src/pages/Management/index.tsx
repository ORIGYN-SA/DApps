import { Flex, SecondaryNav } from '@origyn-sa/origyn-art-ui';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GuestContainer } from '../../components/GuestContainer';
import Dashboard from './Tabs/Dashboard';

const Management = () => {
  const [loggedIn, setLoggedIn] = useState('');

  const handleLogOut = () => {
    setLoggedIn('');
    localStorage.removeItem('apiKey');
  };

  const logIn = async (email, password) => {
    const response = await fetch(
      `https://development.canister.origyn.ch/user/v0/user/authenticate`,
      {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        body: JSON.stringify({
          mail: email,
          password,
          jwt: 'true',
        }),
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
      },
    );
    const d = await response.json();
    setLoggedIn(d.accessToken);
    localStorage.setItem('apiKey', d.accessToken);
  };

  useEffect(() => {
    setLoggedIn(localStorage.getItem('apiKey'));
  }, []);

  return (
    <>
      {loggedIn ? (
        <Flex fullWidth flexFlow="column">
          <SecondaryNav
            title="Vault"
            tabs={[
              { title: 'Dashboard', id: 'dashboard' },
              { title: 'Activity Feed', id: 'activity-feed' },
            ]}
            content={[<Dashboard key="dashboard" />]}
            onLogOut={handleLogOut}
            principal={loggedIn}
          />
        </Flex>
      ) : (
        <GuestContainer onLogin={logIn} />
      )}
    </>
  );
};

export default Management;

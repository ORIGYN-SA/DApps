import React, { useEffect, useContext } from 'react';
import { AuthContext } from '@dapp/features-authentication';
import { GetFormattedLink } from '@dapp/utils';
import Box from '@mui/material/Box';

const LibraryImage = (props: any) => {
  const { canisterId } = useContext(AuthContext);
  const [link, setLink] = React.useState('');
  const formattedLink = async () => {
    const link = await GetFormattedLink(canisterId, props.source);
    setLink(link);
  }
  useEffect(() => {
    formattedLink();
  }, []);

  return (
    <Box
      sx={{
        width: 'auto',
        height: 'auto',
        textAlign: 'center',
      }}
    >
      <img src={link} height="200px"></img>
    </Box>
  );
};

export default LibraryImage;

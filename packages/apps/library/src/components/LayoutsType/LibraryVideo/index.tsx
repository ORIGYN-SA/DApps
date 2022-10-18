import React, { useContext, useEffect } from 'react'
import { AuthContext } from '@dapp/features-authentication';
import { GetFormattedLink } from '@dapp/utils';
import Box from '@mui/material/Box'

const LibraryVideo = (props: any) => {
  const { canisterId } = useContext(AuthContext);
  const [link, setLink] = React.useState('');
  const formattedLink = async () => {
    const link = await GetFormattedLink(canisterId, props.source);
    setLink(link);
  }
  useEffect(() => {
    if(canisterId) {
    formattedLink();
    }
  }, []);

  return (
    <Box
      sx={{
        width: 'auto',
        height: 'auto',
        textAlign: 'center',
      }}
    >
      <video controls height="300px">
        <source src={link} type="video/mp4" />
      </video>
    </Box>
  )
}

export default LibraryVideo

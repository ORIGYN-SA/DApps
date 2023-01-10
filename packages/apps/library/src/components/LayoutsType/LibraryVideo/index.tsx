import React, { useEffect, useState } from 'react';
import { useRoute } from '@dapp/features-authentication';
import { GetFormattedLink } from '@dapp/utils';
import { Flex, HR } from '@origyn-sa/origyn-art-ui';

const LibraryVideo = (props: any) => {
  const [canisterId, setCanisterId] = useState('');
  const [link, setLink] = React.useState('');
  const formattedLink = async () => {
    const link = await GetFormattedLink(canisterId, props.source);
    setLink(link);
  };
  useEffect(() => {
    if (canisterId) {
      formattedLink();
    }
  }, [canisterId,props.source]);

  useEffect(() => {
    useRoute().then(({ canisterId, tokenId }) => {
      setCanisterId(canisterId);
    });
  }, []);

  return (
    <>
      <Flex justify="center" align="center">
        <video controls height="300px">
          <source src={link} type="video/mp4" />
        </video>
      </Flex>
      <HR marginBottom={16} marginTop={16} />
    </>
  );
};

export default LibraryVideo;

import React, { useEffect, useState } from 'react';
import { useRoute } from '@dapp/features-authentication';
import { GetFormattedLink } from '@dapp/utils';
import { Flex, HR } from '@origyn/origyn-art-ui';

export const LibraryDefault = (props: any) => {
  const [canisterId, setCanisterId] = useState('');
  const [link, setLink] = useState('');
  const formattedLink = async () => {
    const link = await GetFormattedLink(canisterId, props.source);
    setLink(link);
  };
  useEffect(() => {
    if (canisterId) {
      formattedLink();
    }
  }, [canisterId, props.source]);

  useEffect(() => {
    useRoute().then(({ canisterId }) => {
      setCanisterId(canisterId);
    });
  }, []);

  return (
    <>
      <Flex flexFlow="row" justify="center">
        <a
          style={{
            fontSize: 12,
          }}
          href={link}
          target="_blank"
          rel="noreferrer"
        >
          {link}
        </a>
      </Flex>
      <HR marginTop={16} marginBottom={16} />
    </>
  );
};

export default LibraryDefault;

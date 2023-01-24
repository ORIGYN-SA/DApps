import React, { useEffect, useState } from 'react';
import { useRoute } from '@dapp/features-authentication';
import { GetFormattedLink } from '@dapp/utils';
import { Flex, Tooltip, HR } from '@origyn-sa/origyn-art-ui';

const LibraryDefault = (props: any) => {
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
        <Tooltip text="Open link">
          <a
            style={{
              fontSize: 12,
            }}
            href={link}
            target="_blank"
          >
            {link}
          </a>
        </Tooltip>
      </Flex>
      <HR marginTop={16} marginBottom={16} />
    </>
  );
};

export default LibraryDefault;

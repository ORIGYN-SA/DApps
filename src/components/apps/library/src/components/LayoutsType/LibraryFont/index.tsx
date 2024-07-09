import React, { useEffect, useState, useContext } from 'react';
import { Flex, HR } from '@origyn/origyn-art-ui';
import { PerpetualOSContext } from '@dapp/features-context-provider';

const LibraryFont = (props: any) => {
  const context = useContext(PerpetualOSContext);
  const [link, setLink] = useState('');

  const formattedLink = async () => {
    setLink(context.directCanisterUrl + '/' + props.source);
  };

  useEffect(() => {
    if (context.canisterId) {
      formattedLink();
    }
  }, [context, props.source]);

  return (
    <>
      <Flex flexFlow="row" justify="center">
        <a
          style={{
            fontSize: 12,
          }}
          href={link}
          download
        >
          {link}
        </a>
      </Flex>
      <HR marginTop={16} marginBottom={16} />
    </>
  );
};

export default LibraryFont;

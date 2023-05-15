import React, { useEffect, useContext } from 'react';
import { Flex, HR } from '@origyn/origyn-art-ui';
import { PerpetualOSContext } from '@dapp/features-context-provider';

const LibraryVideo = (props: any) => {
  const context = useContext(PerpetualOSContext);
  const [link, setLink] = React.useState('');
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

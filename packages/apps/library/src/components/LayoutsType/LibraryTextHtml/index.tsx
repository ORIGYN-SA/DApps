import React, { useEffect, useState } from 'react';
import { useRoute } from '@dapp/features-authentication';
import { GetFormattedLink } from '@dapp/utils';
import { WebContentsType } from './HtmlContents';
import LibraryDefault from '../LibraryDefault';
import { Flex, Container, HR } from '@origyn-sa/origyn-art-ui';

const LibraryTextHtml = (props: any) => {
  const [canisterId, setCanisterId] = useState('');
  const [link, setLink] = useState('');
  const [content, setContent] = useState('');

  const getContent = async () => {
    const arrayFromContentsType = Object.getOwnPropertyNames(WebContentsType);
    console.log('arrayFromContentsType', arrayFromContentsType);
    let formattedLink = await GetFormattedLink(canisterId, props.source);
    let i: any;
    for (i in arrayFromContentsType) {
      if (formattedLink.includes(arrayFromContentsType[i])) {
        setContent(arrayFromContentsType[i]);
        console.log('content', arrayFromContentsType[i]);
        break;
      }
    }
    setLink(formattedLink);
  };

  useEffect(() => {
    if (canisterId) {
      getContent();
    }
  }, [canisterId, props.source]);

  useEffect(() => {
    useRoute().then(({ canisterId }) => {
      setCanisterId(canisterId);
    });
  }, []);

  return (
    <>
      <Container padding="16px">
        <Flex align="center" justify="center">
          <>
            {WebContentsType[content] ? (
              WebContentsType[content](link)
            ) : (
              <LibraryDefault source={props.source} />
            )}
          </>
        </Flex>
      </Container>
      <HR marginBottom={16} marginTop={16} />
    </>
  );
};

export default LibraryTextHtml;

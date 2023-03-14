import React, { useEffect, useState } from 'react';
import { useRoute } from '@dapp/features-authentication';
import { GetFormattedLink } from '@dapp/utils';
import { WebContentsType } from './HtmlContents';
import LibraryDefault from '../LibraryDefault';
import { Flex, Container, HR } from '@origyn/origyn-art-ui';

const LibraryTextHtml = (props: any) => {
  const [canisterId, setCanisterId] = useState('');
  const [link, setLink] = useState('');
  const [content, setContent] = useState('default');

  const getContent = async () => {
    const arrayFromContentsType = Object.getOwnPropertyNames(WebContentsType);
    console.log('arrayFromContentsType', arrayFromContentsType);
    let formattedLink = await GetFormattedLink(canisterId, props.source);
    let i: any;
    for (i in arrayFromContentsType) {
      if (formattedLink.includes(arrayFromContentsType[i])) {
        setContent(arrayFromContentsType[i]);
        break;
      } else {
        setContent('default');
      }
    }
    setLink(formattedLink);
  };

  useEffect(() => {
    if (canisterId) {
      getContent();
    }
  }, [canisterId, props.source, content]);

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
            {content != 'default' ? (
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

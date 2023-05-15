import React, { useEffect, useState, useContext } from 'react';
import { GetFormattedLink } from '@dapp/utils';
import { WebContentsType } from './HtmlContents';
import LibraryDefault from '../LibraryDefault';
import { Flex, Container, HR } from '@origyn/origyn-art-ui';
import { PerpetualOSContext } from '@dapp/features-context-provider';

const LibraryTextHtml = (props: any) => {
  const context = useContext(PerpetualOSContext);
  const [link, setLink] = useState('');
  const [content, setContent] = useState('default');

  const getContent = async () => {
    const arrayFromContentsType = Object.getOwnPropertyNames(WebContentsType);
    let formattedLink = await GetFormattedLink(context.canisterId, props.source);
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
    if (context.canisterId) {
      getContent();
    }
  }, [context, props.source, content]);

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

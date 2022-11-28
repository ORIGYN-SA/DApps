import React, { useEffect, useContext } from 'react';
import Box from '@mui/material/Box';
import { AuthContext } from '@dapp/features-authentication';
import { GetFormattedLink } from '@dapp/utils';
import { WebContentsType } from './HtmlContents';
import LibraryDefault from '../LibraryDefault';

const linkStyle = {
  width: 'auto',
  height: 'auto',
  textAlign: 'center',
  m: 2,
};

const LibraryTextHtml = (props: any) => {
  const { canisterId } = useContext(AuthContext);
  const [link, setLink] = React.useState('');
  const [content, setContent] = React.useState('');

  const getContent = async () => {
    const arrayFromContentsType = Object.getOwnPropertyNames(WebContentsType);
    console.log('arrayFromContentsType', arrayFromContentsType);
    let FormattedLink = await GetFormattedLink(canisterId, props.source);
    let i: any;
    for (i in arrayFromContentsType) {
      if (FormattedLink.includes(arrayFromContentsType[i])) {
        setContent(arrayFromContentsType[i]);
        console.log('content', arrayFromContentsType[i]);
        break;
      }
    }
    setLink(FormattedLink);
  };

  useEffect(() => {
    if (canisterId) {
      getContent();
    }
  }, []);

  return (
    <Box sx={linkStyle}>
      <>
        {WebContentsType[content] ? (
          WebContentsType[content](link)
        ) : (
          <LibraryDefault source={props.source} />
        )}
      </>
    </Box>
  );
};

export default LibraryTextHtml;
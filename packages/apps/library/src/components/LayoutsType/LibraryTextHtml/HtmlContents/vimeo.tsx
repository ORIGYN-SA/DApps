import React, { useEffect } from 'react';
import { set } from 'react-hook-form';

export const Vimeo = (props: any) => {
  const [embedLink, setEmbedLink] = React.useState('');
  console.log('props', props);
  function getEmbedLinkk(url) {
    let vimeoRegex = /(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i;
    let parsed = url.match(vimeoRegex);
    let Formatted: string[] = JSON.parse(JSON.stringify(parsed));
    console.log('parsed', Formatted);
    let i;
    for (i = 0; i < Formatted.length; i++) {
      console.log('Formatted', Formatted[i]);
    }
    return 'https://player.vimeo.com/video/';
  }

  const EmbedLink = async (url) => {
    let vimeoRegex = /(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i;
    let Parsed: string[] = await url.match(vimeoRegex);
    if (Parsed) {
      return 'https://player.vimeo.com/video/' + Parsed[1];
    }
  };

  const SetEmbedLink = async () => {
    setEmbedLink(await EmbedLink(props.htmlContent));
  };

  useEffect(() => {
    SetEmbedLink();
  }, [props.htmlContent]);

  return (
    <div>
      <iframe
        width="560"
        height="315"
        src={embedLink}
        title="Vimeo video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

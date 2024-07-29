import React, { useEffect } from 'react';

export const Vimeo = (props: any) => {
  const [embedLink, setEmbedLink] = React.useState('');

  const EmbedLink = async (url) => {
    let vimeoRegex = /(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i;
    let Parsed: string[] = await url.match(vimeoRegex);
    if (Parsed) {
      return 'https://player.vimeo.com/video/' + Parsed[1];
    }
  };

  const SetEmbedLink = async () => {
    const link = await EmbedLink(props.htmlContent);
    if (link) {
      setEmbedLink(link);
    }
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

import React, { useEffect } from 'react';

export const YouTube = (props: any) => {
    const [embedLink, setEmbedLink] = React.useState('');
    function getEmbedLink(url) {
      var ID = '';
      url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
      if (url[2] !== undefined) {
        ID = url[2].split(/[^0-9a-z_\-]/i);
        ID = ID[0];
      } else {
        ID = url;
      }
      return "https://www.youtube.com/embed/"+ID;
    }
    useEffect(() => {
      setEmbedLink(getEmbedLink(props.htmlContent));
    }, [props.htmlContent]);
  
    return (
      <div>
        <iframe
          width="560"
          height="315"
          src={embedLink}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  };
import React, { useEffect, useContext, useState } from 'react'
import Box from '@mui/material/Box'
import FontDownloadIcon from '@mui/icons-material/FontDownload';
import { AuthContext, useRoute } from '@dapp/features-authentication';
import { GetFormattedLink } from '@dapp/utils';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));


const linkStyle = {
  width: 'auto',
  height: 'auto',
  textAlign: 'center',
  m: 2,
}

const LibraryFont = (props: any) => {
  const [canisterId, setCanisterId] = useState("");
  const [link, setLink] = useState('');
  const formattedLink = async () => {
    const link = await GetFormattedLink(canisterId, props.source);
    setLink(link);
  }
  useEffect(() => {
    if(canisterId) {
    formattedLink();
    }
  }, [canisterId,props.source]);

  useEffect(() => {
    useRoute().then(({ canisterId, tokenId }) => {
      setCanisterId(canisterId);
    });
  }, []);

  return (
    <Box sx={linkStyle}>
       <HtmlTooltip
        title={
          <React.Fragment>
            <Typography color="inherit">Font Type</Typography>
            <em>{link}</em> <br></br><b><a href={link} target='_self'>{'Download Font Here'}</a></b>{' '}
          </React.Fragment>
        }
      >
         <FontDownloadIcon sx={{ fontSize: 50 }} />
      </HtmlTooltip>
    </Box>
  )
}

export default LibraryFont;

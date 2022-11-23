import React, { useContext, useEffect } from 'react'
import Box from '@mui/material/Box'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { AuthContext } from '@dapp/features-authentication';
import { GetFormattedLink } from '@dapp/utils';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { Typography } from '@mui/material';

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

const LibraryDefault = (props: any) => {
  const { canisterId } = useContext(AuthContext);
  const [link, setLink] = React.useState('');
  const formattedLink = async () => {
    const link = await GetFormattedLink(canisterId, props.source);
    setLink(link);
  }
  useEffect(() => {
    if(canisterId) {
    formattedLink();
    }
  }, []);

  return (
    <Box sx={linkStyle}>
      <HtmlTooltip
        title={
          <React.Fragment>
            <Typography color="inherit"></Typography>
            <em>{link}</em> <br></br><b><a href={link} rel="noreferrer" target='_blank'>{'Open Link'}</a></b>{' '}
          </React.Fragment>
        }
      >
        <InsertDriveFileIcon sx={{ fontSize: 50 }} />
      </HtmlTooltip>
    </Box>
  )
}

export default LibraryDefault

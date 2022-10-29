import React, { useEffect, useContext } from 'react';
import Box from '@mui/material/Box';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { AuthContext } from '@dapp/features-authentication';
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
};

const LibraryTextHtml = (props: any) => {
  const { canisterId } = useContext(AuthContext);
  const [link, setLink] = React.useState('');
  const formattedLink = async () => {
    const link = await GetFormattedLink(canisterId, props.source);
    setLink(link);
  };

  useEffect(() => {
    if (canisterId) {
      formattedLink();
    }
  }, []);

  return (
    <Box sx={linkStyle}>
      <HtmlTooltip
        title={
          <React.Fragment>
            <Typography color="inherit">Text/Html Type</Typography>
            <em>{link}</em> <br></br>
            <b>
              <a href={link} target="_blank">
                {'Open Link '}
              </a>
            </b>{' '}
          </React.Fragment>
        }
      >
        <InsertDriveFileIcon sx={{ fontSize: 50 }} />
      </HtmlTooltip>
    </Box>
  );
};

export default LibraryTextHtml;

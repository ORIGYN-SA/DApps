import React, { useEffect, useContext } from 'react';
import { AuthContext } from '@dapp/features-authentication';
import { GetFormattedLink } from '@dapp/utils';
import Box from '@mui/material/Box';
import { Modal } from '@mui/material';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const LibraryImage = (props: any) => {
  // MODAL
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
    <>
      <Box
        sx={{
          width: 'auto',
          height: 'auto',
          textAlign: 'center',
        }}
      > 
        <img src={link} height="200px" 
        onClick={handleOpen} 
        style={{cursor: 'zoom-in'}}
        />
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <img src={link} style={{height:'70vh'}}></img>
        </Box>
      </Modal>
    </>
  );
};

export default LibraryImage;

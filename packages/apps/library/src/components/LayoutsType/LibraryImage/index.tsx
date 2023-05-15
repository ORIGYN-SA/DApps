import React, { useEffect, useState, useContext } from 'react';
import { Modal, Flex, Container, HR, Image, Grid } from '@origyn/origyn-art-ui';
import { PerpetualOSContext } from '@dapp/features-context-provider';

const LibraryImage = (props: any) => {
  const context = useContext(PerpetualOSContext);
  // MODAL
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [link, setLink] = useState('');

  const formattedLink = async () => {
    setLink(context.directCanisterUrl + '/' + props.source);
  };

  useEffect(() => {
    if (context.canisterId) {
      formattedLink();
    }
  }, [context, props.source]);

  return (
    <>
      <Grid columns={3}>
        <Grid column={1}></Grid>
        <Grid column={2}>
          <Flex justify="center" align="center">
            <Image src={link} onClick={handleOpen} style={{ cursor: 'zoom-in' }} />
          </Flex>
        </Grid>
        <Grid column={3}></Grid>
      </Grid>
      <HR marginBottom={16} marginTop={16} />
      <Modal closeModal={handleClose} isOpened={open} mode="light" size="md">
        <Container padding="16px">
          <Flex justify="center" align="center">
            <Image src={link} />
          </Flex>
        </Container>
      </Modal>
    </>
  );
};

export default LibraryImage;

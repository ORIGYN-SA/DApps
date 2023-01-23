import React, { useEffect, useState, useRef } from 'react';
import { useRoute } from '@dapp/features-authentication';
import { GetFormattedLink } from '@dapp/utils';
import { Modal, Flex, Container, HR, Image, Grid } from '@origyn-sa/origyn-art-ui';

const LibraryImage = (props: any) => {
  // MODAL
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [canisterId, setCanisterId] = useState('');
  const [link, setLink] = useState('');

  const formattedLink = async () => {
    const link = await GetFormattedLink(canisterId, props.source);
    setLink(link);
  };

  useEffect(() => {
    if (canisterId) {
      formattedLink();
    }
  }, [canisterId, props.source]);

  useEffect(() => {
    useRoute().then(({ canisterId }) => {
      setCanisterId(canisterId);
    });
  }, [props.source]);

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

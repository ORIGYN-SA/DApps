import * as React from 'react';
import { LoadingContainer } from '@dapp/features-components';
import { useSnackbar } from 'notistack';
import { Container, Flex, Modal, Button, Card, TextInput } from '@origyn-sa/origyn-art-ui';
import { useParams } from 'react-router-dom';

export const ConnectQRModal = (props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { nft_id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [linkCode, setLinkCode] = React.useState('');
  const { isOpen, onClose } = props;

  const handleLink = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://development.origyn.network/canister/v0/token/${linkCode}`,
        {
          method: 'PATCH', // *GET, POST, PUT, DELETE, etc.
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem('apiKey').toString(),
          },
          body: JSON.stringify({ tokenId: nft_id }),
        },
      );
      console.log(response);
      setIsLoading(false);
      if (response.status === 200) {
        onClose();
        enqueueSnackbar('QR code connected Successfully!', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
      } else {
        enqueueSnackbar('Failed to connect QR!', {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
      }
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  };

  return (
    <div>
      <Modal isOpened={isOpen} closeModal={() => onClose(false)} size="md">
        <Container size="full" padding="48px">
          <h2>Link QR code to Certificate</h2>
          <TextInput
            label="Link Code"
            value={linkCode}
            onChange={(e) => setLinkCode(e.target.value)}
          />
          <Button onClick={handleLink}>Link QR</Button>
          {isLoading && (
            <div style={{ marginTop: 5 }}>
              <LoadingContainer />
            </div>
          )}
        </Container>
      </Modal>
    </div>
  );
};

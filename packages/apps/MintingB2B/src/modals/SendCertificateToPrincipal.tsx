import * as React from 'react';
import { LoadingContainer } from '@dapp/features-components';
import { useSnackbar } from 'notistack';
import { Container, Flex, Modal, Button, Card, TextInput } from '@origyn-sa/origyn-art-ui';
import { useParams } from 'react-router-dom';

export const SendCertificateToPrincipal = (props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { nft_id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [principal, setPrincipal] = React.useState('');
  const { isOpen, onClose } = props;

  const handleSend = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://development.origyn.network/canister/v0/nft-token/${nft_id}/mint-to-principal`,
        {
          method: 'PATCH', // *GET, POST, PUT, DELETE, etc.
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem('apiKey').toString(),
          },
          body: JSON.stringify({ principalId: principal }),
        },
      );

      if(response.status === 200) {
        enqueueSnackbar("NFT is minting to user Principal", {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
        onClose();
      }
    } catch (e) {
      console.log(e);
      enqueueSnackbar("Something went wrong", {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
    }
    setIsLoading(false);
  };

  return (
    <div>
      <Modal isOpened={isOpen} closeModal={() => onClose(false)} size="md">
        <Container size="full" padding="48px">
          {isLoading ? (
            <div style={{ marginTop: 5 }}>
              <LoadingContainer />
            </div>
          ) : (
            <>
            <h2>Send Certificate to User Principal</h2>
            <TextInput
              label="Principal"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
            />
            <Button btnType="filled" onClick={handleSend}>Mint and Send Certificate</Button>
            </>
          )}
        </Container>
      </Modal>
    </div>
  );
};

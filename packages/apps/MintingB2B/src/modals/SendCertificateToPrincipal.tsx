import * as React from 'react';
import { LoadingContainer } from '@dapp/features-components';
import { useSnackbar } from 'notistack';
import { Container, Flex, Modal, Button, Card, TextInput } from '@origyn-sa/origyn-art-ui';
import { useParams } from 'react-router-dom';

export const SendCertificateToPrincipal = (props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { nft_id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [linkCode, setLinkCode] = React.useState('');
  const { isOpen, onClose } = props;

  const handleLink = async () => {
    setIsLoading(true);
    try {
      
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  };

  return (
    <div>
      <Modal isOpened={isOpen} closeModal={() => onClose(false)} size="md">
        <Container size="full" padding="48px">
          <h2>Send Certificate to User Principal</h2>
          <TextInput
            label="Principal"
            value={linkCode}
            onChange={(e) => setLinkCode(e.target.value)}
          />
          <Button btnType="filled" onClick={handleLink}>Mint and Send Certificate</Button>
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

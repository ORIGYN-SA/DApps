import * as React from 'react';
import { LoadingContainer } from '@dapp/features-components';
import { useSnackbar } from 'notistack';
import { Container, Flex, Modal, Button, Card, TextInput, Select } from '@origyn-sa/origyn-art-ui';
import { useParams } from 'react-router-dom';

export const ConnectQRModal = (props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [principal, setPrincipal] = React.useState('');
  const [transferType, setTransferType] = React.useState({ value: 'wallet', label: "Wallet Transfer" });
  const { nft_id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [linkCode, setLinkCode] = React.useState('');
  const { isOpen, onClose, loggedIn } = props;

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

      if (response.status === 200) {
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



  const generateQR = async () => {
    const response = await fetch(`https://development.canister.origyn.ch/canister/v0/token`, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'x-access-token': loggedIn,
      },
      body: JSON.stringify({ amount: 1 }),
    });
    console.log(response);
    const data = await response.blob();

    const downloadUrl = URL.createObjectURL(data);
    const a = document.createElement('a');
    // safari doesn't support this yet
    if (typeof a.download === 'undefined') {
      window.location.href = downloadUrl;
    } else {
      a.href = downloadUrl;
      a.download = 'qrcode.zip';
      document.body.appendChild(a);
      a.click();
    }
    console.log(data);
  };

  return (
    <div>
      <Modal isOpened={isOpen} closeModal={() => onClose(false)} size="md">
        <Container size="full" padding="48px">
          <h2>Transfer Ownership</h2>
          <br />
          <p>Select transfer type and fill in the corresponding details.</p>
          <br />
          <Select
            selectedOption={transferType}
            options={[
              { value: 'wallet', label: "Wallet Transfer" },
              { value: 'qrCode', label: "QR Code Transfer" },
            ]}
            handleChange={setTransferType}
          />
          <br />
          {
            transferType.value === "wallet" ? (
              <>
                <TextInput
                  label="Principal"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                />
                <Button btnType="filled" onClick={handleSend}>Mint and Send Certificate</Button>
              </>
            ) : (
              <>
                <Button onClick={generateQR} btnType="filled" style={{ width: "100%" }}>
                  Generate QR
                </Button>
                <br />
                <TextInput
                  label="Link Code"
                  value={linkCode}
                  onChange={(e) => setLinkCode(e.target.value)}
                />
                <Button onClick={handleLink}>Link QR</Button>
              </>
            )
          }
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

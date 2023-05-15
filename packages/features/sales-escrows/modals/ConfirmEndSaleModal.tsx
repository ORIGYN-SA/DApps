import React, { useEffect, useState } from 'react';
import { AuthContext } from '@dapp/features-authentication';
import { LoadingContainer } from '@dapp/features-components';
import { Container, Flex, Modal, Button, HR } from '@origyn/origyn-art-ui';
import { useUserMessages } from '@dapp/features-user-messages';
import { ERROR } from '../constants';

interface ConfirmEndSaleModalProps {
  onModalOpen: boolean;
  onModalClose: () => void;
  currentToken: string;
  onSaleCancelled?: () => void;
  onProcessing?: (boolean) => void;
}

export const ConfirmEndSaleModal = ({
  onModalOpen,
  onModalClose,
  currentToken,
  onSaleCancelled,
  onProcessing,
}: ConfirmEndSaleModalProps) => {
  const { actor } = React.useContext(AuthContext);
  const { showErrorMessage, showSuccessMessage, showUnexpectedErrorMessage } = useUserMessages();
  const [isLoading, setIsLoading] = React.useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const onEndSaleConfirm = async (confirm: boolean) => {
    if (!confirm) {
      onModalClose();
      return;
    } else if (isLoading || !actor) {
      return;
    }
    try {
      setIsLoading(true);
      setConfirmed(true);
      onProcessing?.(true);

      const endSaleResponse = await actor.sale_nft_origyn({
        end_sale: currentToken,
      });
      if ('ok' in endSaleResponse) {
        showSuccessMessage(`You have successfully ended the sale for ${currentToken}.`);
        onSaleCancelled();
      } else {
        showErrorMessage(`${ERROR.endSale} ${currentToken}`, endSaleResponse.err.flag_point);
      }
    } catch (e) {
      showUnexpectedErrorMessage(e);
    } finally {
      onProcessing?.(false);
      setIsLoading(false);
      onModalClose();
    }
  };

  useEffect(() => {
    setConfirmed(false);
  }, [onModalOpen]);

  return (
    <Modal isOpened={onModalOpen} closeModal={() => onEndSaleConfirm(false)} size="md">
      <Container size="full" padding="48px">
        <h2>Confirm End Sale</h2>
        <br />
        {isLoading ? (
          <>
            <HR marginTop={24} />
            <LoadingContainer margin="24px" />
          </>
        ) : (
          <>
            <Flex flexFlow="column">
              <div>
                Are you sure you want to end the sale for token <b>{currentToken}</b> ?
              </div>
            </Flex>
            <HR marginTop={24} marginBottom={24} />
            <Flex flow="row" justify="flex-end" gap={16}>
              <Flex>
                <Button
                  onClick={() => onEndSaleConfirm(true)}
                  variant="contained"
                  disabled={confirmed}
                >
                  Confirm
                </Button>
              </Flex>
            </Flex>
          </>
        )}
      </Container>
    </Modal>
  );
};

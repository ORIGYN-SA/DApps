import React, { useEffect, useState } from 'react';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { AuthContext } from '@dapp/features-authentication';
import { LoadingContainer } from '@dapp/features-components';
import { useSnackbar } from 'notistack';
import { Container, Flex, Modal, Button, HR } from '@origyn-sa/origyn-art-ui';
import { useDebug } from '@dapp/features-debug-provider';

const Transition = React.forwardRef(
  (
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
  ) => <Slide direction="up" ref={ref} {...props} />,
);

Transition.displayName = 'Transition';

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
  const [isLoading, setIsLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar() || {};
  const [confirmed, setConfirmed] = useState(false);
  const debug = useDebug();

  const onEndSaleConfirm = async (confirm = false) => {
    if (!confirm) {
      onModalClose();
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
      if (endSaleResponse.ok) {
        enqueueSnackbar(`You have successfully ended the sale for ${currentToken}.`, {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
        onSaleCancelled();
      } else {
        enqueueSnackbar(`Error: ${endSaleResponse.err.flag_point}.`, {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
      }
    } catch (e) {
      debug.log(e);
      enqueueSnackbar(`Error: ${e}.`, {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
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
    <Modal isOpened={onModalOpen} closeModal={() => onModalClose()} size="md">
      <Container size="full" padding="48px">
        <h2>Confirm End Sale</h2>
        <br />
        <Flex flexFlow="column">
          <div>
            Are you sure you want to end the sale for token <b>{currentToken}</b> ?
          </div>
        </Flex>
        <HR marginTop={24} marginBottom={24} />
        <Flex flow="row" justify="flex-end" gap={16}>
          <Flex>
            <Button onClick={() => onEndSaleConfirm(false)} disabled={confirmed}>
              Cancel
            </Button>
          </Flex>
          <Flex>
            <Button onClick={() => onEndSaleConfirm(true)} variant="contained" disabled={confirmed}>
              Confirm
            </Button>
          </Flex>
        </Flex>
        {isLoading && (
          <>
            <HR marginTop={24} marginBottom={24} />
            <LoadingContainer />
          </>
        )}
      </Container>
    </Modal>
  );
};

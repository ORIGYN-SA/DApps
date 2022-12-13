import * as React from 'react';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { AuthContext } from '@dapp/features-authentication';
import { LoadingContainer } from '@dapp/features-components';
import { useSnackbar } from 'notistack';
import { Container, Flex, Modal, Button, Card } from '@origyn-sa/origyn-art-ui';

const Transition = React.forwardRef(
  (
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
  ) => <Slide direction="up" ref={ref} {...props} />,
);

Transition.displayName = 'Transition';

export const ConfirmSalesActionModal = ({
  openConfirmation,
  handleClose,
  currentToken,
  action,
  escrow = null,
}: any) => {
  const { actor, principal } = React.useContext(AuthContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar() || {};
  const _handleClose = async (confirm = false) => {
    if (confirm && actor) {
      if (isLoading) return;
      setIsLoading(true); 
      if (action === 'endSale') {
        const endSaleResponse = await actor.end_sale_nft_origyn(currentToken);
        console.log('error here')
        if (endSaleResponse.ok) {
          enqueueSnackbar(`You have successfully ended the sale for ${currentToken}.`, {
            variant: 'success',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
          });
          setIsLoading(false);
          return handleClose(true);
        }
        enqueueSnackbar(`Error: ${endSaleResponse.err.flag_point}.`, {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
        setIsLoading(false);
        return handleClose(false);
      }
      if (action === 'withdraw') {
        if (!escrow) {
          return handleClose(false);
        }
        const withdrawResponse = await actor?.sale_nft_origyn({
          withdraw: {
            escrow: {
              ...escrow,
              withdraw_to: { principal },
            },
          },
        });

        if ('err' in withdrawResponse) {
          enqueueSnackbar(`Error: ${withdrawResponse.err.flag_point}.`, {
            variant: 'error',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
          });
        } else {
          enqueueSnackbar('Your escrow has been successfully withdrawn.', {
            variant: 'success',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
          });
          setIsLoading(false);
          return handleClose(true);
        }

        setIsLoading(false);
        return handleClose(false);
      }
      if (action === 'reject') {
        if (!escrow) {
          return handleClose(false);
        }
        const rejectResponse = await actor?.sale_nft_origyn({
          withdraw: {
            reject: {
              ...escrow,
            },
          },
        });

        if ('err' in rejectResponse) {
          enqueueSnackbar(`Error: ${rejectResponse.err.text}.`, {
            variant: 'error',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
          });
        } else {
          enqueueSnackbar('The escrow has been rejected.', {
            variant: 'success',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
          });
          setIsLoading(false);
          return handleClose(true);
        }
        setIsLoading(false);
        return handleClose(false);
      }
    }
    handleClose(false);
  };
  return (
    <div>
      <Modal 
      isOpened={openConfirmation} 
      closeModal={() => handleClose(false)} 
      size="md"
      >
      <Container size="full" padding="48px">
        <h2>
          {action === 'endSale'
            ? 'Confirm End Sale'
            : action === 'withdraw'
            ? 'Confirm Escrow Withdraw'
            : 'Confirm Escrow Rejection'}
        </h2>
        <br/>
       <Flex flexFlow="column">
              {action === 'endSale' ? (
                <>
                  Are you sure you want to end the sale for token{' '}
                  <strong>
                    {currentToken}
                  </strong>
                  ?
                </>
              ) : action === 'withdraw' ? (
                <>Are you sure you want to withdraw the escrow?</>
              ) : (
                <>Are you sure you want to reject the escrow?</>
              )}

        </Flex>
        <Flex flow='row' justify='flex-end'>
          <Button onClick={() => _handleClose(false)}>Cancel</Button>
          <Button onClick={() => _handleClose(true)} variant="contained">
            Confirm
          </Button>
          </Flex>
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

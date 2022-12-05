import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { AuthContext } from '@dapp/features-authentication';
import { LoadingContainer } from '@dapp/features-components';
import { useSnackbar } from 'notistack';
import styled from 'styled-components';

const ConfirmButton = styled.button`
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
padding: 9px 16px 9px 20px;
background: #F2F2F2;
border-radius: 999px;
width: 141px;
height: 40px;
`

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
  open,
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
      const tokenId = currentToken?.Class?.find(({ name }) => name === 'id').value.Text;
      if (action === 'endSale') {
        const endSaleResponse = await (actor).end_sale_nft_origyn(tokenId);
        if (endSaleResponse.ok) {
          enqueueSnackbar(`You have successfully ended the sale for ${tokenId}.`, {
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
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => handleClose(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          {action === 'endSale'
            ? 'Confirm End Sale?'
            : action === 'withdraw'
            ? 'Confirm Escrow Withdraw'
            : 'Confirm Escrow Rejection'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <div style={{ opacity: isLoading ? '0.4' : '1' }}>
              {action === 'endSale' ? (
                <>
                  Are you sure you want to end the sale for token{' '}
                  <strong>
                    {currentToken?.Class?.find(({ name }) => name === 'id').value.Text}
                  </strong>
                  ?
                </>
              ) : action === 'withdraw' ? (
                <>Are you sure you want to withdraw the escrow?</>
              ) : (
                <>Are you sure you want to reject the escrow?</>
              )}
            </div>
            {isLoading && (
              <div style={{ marginTop: 5 }}>
                <LoadingContainer />
              </div>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => _handleClose(false)}>Cancel</Button>
          <ConfirmButton onClick={() => _handleClose(true)}>
            Confirm
            </ConfirmButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

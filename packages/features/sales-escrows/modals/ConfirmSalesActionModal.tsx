import React, { useState } from 'react';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { AuthContext } from '@dapp/features-authentication';
import { LoadingContainer } from '@dapp/features-components';
import { useSnackbar } from 'notistack';
import { Container, Flex, Modal, Button } from '@origyn-sa/origyn-art-ui';
import { useTokensContext } from '@dapp/features-tokens-provider';
import { Principal } from '@dfinity/principal';

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
  offer,
}: any) => {
  const { actor, principal } = React.useContext(AuthContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar() || {};
  const { tokens } = useTokensContext();
  const [confirmed, setConfirmed] = useState(false);

  const _handleClose = async (confirm = false) => {
    if (confirm && actor) {
      if (isLoading) return;
      setIsLoading(true);
      setConfirmed(true);
      if (action === 'endSale') {
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

      const escrowReceipt = {
        seller: { principal: offer.seller.principal },
        buyer: { principal: offer.buyer.principal },
        token_id: currentToken,
        token: {
          ic: {
            fee: BigInt(tokens[offer.token.ic.symbol]?.fee ?? 200000),
            decimals: BigInt(tokens[offer.token.ic.symbol]?.decimals ?? 8),
            canister: Principal.fromText(tokens[offer.token.ic.symbol]?.canisterId),
            standard: { Ledger: null },
            symbol: offer.token.ic.symbol,
          },
        },
        amount: BigInt(offer.amount),
      };

      const saleReceipt = {
        broker_id: [],
        pricing: { instant: null },
        escrow_receipt: [escrowReceipt],
      };

      if (action === 'acceptOffer') {
        try {
          const acceptOffer = await actor.market_transfer_nft_origyn({
            token_id: currentToken,
            sales_config: saleReceipt,
          });
          console.log(acceptOffer.err);
          if ('err' in acceptOffer) {
            enqueueSnackbar('There has been an error in accepting the offer', {
              variant: 'error',
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
            });
          } else {
            enqueueSnackbar('The offer has been accepted.', {
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
        } catch (e) {
          console.log(e);
        }
      }
    }
    handleClose(false);
  };

  return (
    <Modal isOpened={openConfirmation} closeModal={() => handleClose(false)} size="md">
      <Container size="full" padding="48px">
        <h2>
          {action === 'acceptOffer'
            ? 'Confirm Accept Offer'
            : action === 'endSale'
            ? 'Confirm End Sale'
            : action === 'withdraw'
            ? 'Confirm Escrow Withdraw'
            : 'Confirm Escrow Rejection'}
        </h2>
        <br />
        <Flex flexFlow="column">
          {action === 'acceptOffer' ? (
            <div>
              Are you sure you want to accept the offer for token <b>{currentToken}</b> ?
            </div>
          ) : action === 'endSale' ? (
            <div>
              Are you sure you want to end the sale for token <b>{currentToken}</b> ?
            </div>
          ) : action === 'withdraw' ? (
            <>Are you sure you want to withdraw the escroww?</>
          ) : (
            <>Are you sure you want to reject the escrow?</>
          )}
        </Flex>
        <Flex flow="row" justify="flex-end">
          <Button onClick={() => _handleClose(false)}>Cancel</Button>
          <Button onClick={() => _handleClose(true)} variant="contained" disabled={confirmed}>
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
  );
};

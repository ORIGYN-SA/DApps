import React, { useContext, useEffect, useState } from 'react';
import { AuthContext, useRoute } from '@dapp/features-authentication';
import { Container, Flex, Modal, Button } from '@origyn-sa/origyn-art-ui';
import { ConfirmSalesActionModal } from './ConfirmSalesActionModal';
import { getBalance, useTokensContext } from '@dapp/features-tokens-provider';
import { getAccountId } from '@dapp/utils';
import { Principal } from '@dfinity/principal';
import { useSnackbar } from 'notistack';
import { LoadingContainer } from '@dapp/features-components';

const ManageDepositsModal = ({ open, handleClose, collection }: any) => {
  const { principal, actor } = useContext(AuthContext);
  const [depositPrincipal, setDepositPrincipal] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const [tokenBalances, setTokenBalances] = useState<any>({});
  const { activeTokens } = useTokensContext();

  const withdraw = async (token) => {
    setIsLoading(true);
    console.log(depositPrincipal, tokenBalances[token].value);
    const withdrawResp = await actor.sale_nft_origyn({
      withdraw: {
        deposit: {
          'token': {
            ic: {
              'fee': activeTokens[token]?.fee,
              'decimals': activeTokens[token]?.decimals,
              'canister': Principal.fromText(activeTokens[token]?.canisterId),
              'standard': { 'Ledger': null },
              'symbol': activeTokens[token]?.symbol,
            }
          },
          'withdraw_to': { principal },
          'buyer': { principal },
          'amount': BigInt(tokenBalances[token].value),
        }
      }
    })
    console.log(withdrawResp);
    if ("err" in withdrawResp) {
      enqueueSnackbar('Failed to withdraw', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
    } else {
      enqueueSnackbar('Succesfully withdrawned', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
    }
    await getBalances();
    setIsLoading(false);
  };

  const getBalances = async () => {

    console.log(principal, actor);
    const r = await actor?.sale_info_nft_origyn({ deposit_info: [{ principal }] });
    setDepositPrincipal(r.ok.deposit_info.principal);

    const balances = Object.keys(activeTokens).map(async (k) => {
      const val = await getBalance(false, r.ok.deposit_info.principal, activeTokens[k]);
      return { [k]: val };
    })
    console.log(balances);

    Promise.all(Object.values(balances)).then(values => {
      console.log(values);

      const b = values.reduce(
        (obj, item) => Object.assign(obj, { [Object.keys(item)[0]]: Object.values(item)[0] }), {});

      console.log(b);
      setTokenBalances(b);
    })
  }

  useEffect(() => {
    getBalances();
  }, [open]);

  return (
    <div>
      <Modal isOpened={open} closeModal={() => handleClose(false)} size="md">
        <Container size="full" padding="48px">
          <h3>Manage Token Deposits</h3>
          <br />
          {
            isLoading ? (<>
            <LoadingContainer />
            </>) : (
              <>
                {Object.keys(activeTokens).map((k) => {
                  return (
                    <>
                      <Flex flexFlow="row" justify="space-around">
                        <Flex flexFlow="column">
                          <span>Token</span>
                          <span style={{ color: 'grey' }}>{k}</span>
                        </Flex>
                        <Flex flexFlow="column">
                          <span style={{ color: 'grey' }}>Amount</span>
                          <span>{tokenBalances[k]?.value}</span>
                        </Flex>
                        <Button
                          btnType="filled"
                          size="small"
                          onClick={() => withdraw(k)}
                        >
                          Withdraw
                        </Button>
                      </Flex>
                      <br />
                      <br />
                    </>
                  )
                })}
              </>
            )
          }
        </Container>
      </Modal>
    </div>
  );
};

export default ManageDepositsModal;

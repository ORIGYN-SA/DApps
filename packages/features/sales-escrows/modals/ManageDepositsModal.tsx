import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@dapp/features-authentication';
import { Container, Flex, Modal, Button } from '@origyn-sa/origyn-art-ui';
import { getBalanceByAccount, useTokensContext } from '@dapp/features-tokens-provider';
import { Principal } from '@dfinity/principal';
import { useSnackbar } from 'notistack';
import { LoadingContainer } from '@dapp/features-components';
import { useDebug } from '@dapp/features-debug-provider';

const ManageDepositsModal = ({ open, handleClose }: any) => {
  const { principal, actor } = useContext(AuthContext);
  const debug = useDebug();
  //const [depositPrincipal, setDepositPrincipal] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const [tokenBalances, setTokenBalances] = useState<any>({});
  const { activeTokens, refreshAllBalances } = useTokensContext();

  const withdraw = async (token) => {
    try {
      setIsLoading(true);
      const withdrawResp = await actor.sale_nft_origyn({
        withdraw: {
          deposit: {
            token: {
              ic: {
                fee: activeTokens[token]?.fee,
                decimals: activeTokens[token]?.decimals,
                canister: Principal.fromText(activeTokens[token]?.canisterId),
                standard: { Ledger: null },
                symbol: activeTokens[token]?.symbol,
              },
            },
            withdraw_to: { principal },
            buyer: { principal },
            amount: BigInt(tokenBalances[token].value),
          },
        },
      });
      if ('err' in withdrawResp) {
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
    } catch (e) {
      debug.log(e);
    } finally {
      setIsLoading(false);
      await getDepositInfo();
      refreshAllBalances(false, principal);
    }
  };

  const getDepositInfo = async () => {
    try {
      const r = await actor?.sale_info_nft_origyn({ deposit_info: [{ principal }] });
      //setDepositPrincipal(r.ok.deposit_info.principal);
      const balances = Object.keys(activeTokens).map(async (k) => {
        const val = await getBalanceByAccount(
          false,
          r?.ok?.deposit_info?.account_id_text || '',
          activeTokens[k],
        );
        return { [k]: val };
      });

      Promise.all(Object.values(balances)).then((values) => {
        const b = values.reduce(
          (obj, item) => Object.assign(obj, { [Object.keys(item)[0]]: Object.values(item)[0] }),
          {},
        );
        setTokenBalances(b);
      });
    } catch (e) {
      debug.log(e);
    }
  };

  useEffect(() => {
    if (actor) {
      getDepositInfo();
    }
  }, [open, actor]);

  const parseDecimals = (data) => {
    const res = parseFloat((parseInt(data) * 1e-8).toString()).toFixed(2);
    return res;
  };

  return (
    <div>
      <Modal isOpened={open} closeModal={() => handleClose(false)} size="md">
        <Container size="full" padding="48px">
          <h3>Manage Token Deposits</h3>
          <br />
          {isLoading ? (
            <>
              <LoadingContainer />
            </>
          ) : (
            <>
              {Object.keys(activeTokens).map((k) => {
                return (
                  <div key={k}>
                    <Flex flexFlow="row" justify="space-around">
                      <Flex flexFlow="column">
                        <span>Token</span>
                        <span style={{ color: 'grey' }}>{k}</span>
                      </Flex>
                      <Flex flexFlow="column">
                        <span style={{ color: 'grey' }}>Amount</span>
                        <span>{parseDecimals(tokenBalances[k]?.value)}</span>
                      </Flex>
                      <Button
                        btnType="filled"
                        size="small"
                        onClick={() => withdraw(k)}
                        disabled={tokenBalances[k]?.value.toString() === '0'}
                      >
                        Withdraw
                      </Button>
                    </Flex>
                    <br />
                    <br />
                  </div>
                );
              })}
            </>
          )}
        </Container>
      </Modal>
    </div>
  );
};

export default ManageDepositsModal;

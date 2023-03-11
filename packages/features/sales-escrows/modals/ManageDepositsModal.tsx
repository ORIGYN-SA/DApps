import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@dapp/features-authentication';
import { Container, Flex, Modal, Button } from '@origyn-sa/origyn-art-ui';
import { getBalanceByAccount, useTokensContext } from '@dapp/features-tokens-provider';
import { Principal } from '@dfinity/principal';
import { LoadingContainer } from '@dapp/features-components';
import { useDebug } from '@dapp/features-debug-provider';
import { useUserMessages } from '@dapp/features-user-messages';
import { toLargerUnit } from '@dapp/utils';

const ManageDepositsModal = ({ open, handleClose }: any) => {
  const debug = useDebug();
  const { principal, actor } = useContext(AuthContext);
  const { showErrorMessage, showSuccessMessage, showUnexpectedErrorMessage } = useUserMessages();
  //const [depositPrincipal, setDepositPrincipal] = useState();
  const [isLoading, setIsLoading] = useState(false);

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
        showErrorMessage('Failed to withdraw', withdrawResp.err);
      } else {
        showSuccessMessage('Withdrawal successful');
      }
    } catch (e) {
      showUnexpectedErrorMessage(e);
    } finally {
      setIsLoading(false);
      await getDepositInfo();
      refreshAllBalances(false, principal);
    }
  };

  const getDepositInfo = async () => {
    try {
      const result = await actor?.sale_info_nft_origyn({ deposit_info: [{ principal }] });
      debug.log('sale_info_nft_origyn result', result);

      if ('err' in result) {
        throw new Error(result.err.text);
      } else {
        const balances = Object.keys(activeTokens).map(async (tokenSymbol) => {
          const val = await getBalanceByAccount(
            false,
            result.ok?.deposit_info?.account_id_text || '',
            activeTokens[tokenSymbol],
          );
          return { [tokenSymbol]: val };
        });

        Promise.all(Object.values(balances)).then((values) => {
          const b = values.reduce(
            (obj, item) => Object.assign(obj, { [Object.keys(item)[0]]: Object.values(item)[0] }),
            {},
          );
          setTokenBalances(b);
        });
      }
    } catch (e) {
      throw showUnexpectedErrorMessage(e);
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
              {Object.keys(activeTokens).map((tokenSymbol) => {
                return (
                  <div key={tokenSymbol}>
                    <Flex flexFlow="row" justify="space-around">
                      <Flex flexFlow="column">
                        <span>Token</span>
                        <span style={{ color: 'grey' }}>{tokenSymbol}</span>
                      </Flex>
                      <Flex flexFlow="column">
                        <span style={{ color: 'grey' }}>Amount</span>
                        <span>
                          {toLargerUnit(
                            tokenBalances[tokenSymbol]?.value || 0,
                            activeTokens[tokenSymbol].decimals,
                          )}
                        </span>
                      </Flex>
                      {console.log(typeof tokenBalances[tokenSymbol]?.value)}
                      <Button
                        btnType="filled"
                        size="small"
                        onClick={() => withdraw(tokenSymbol)}
                        disabled={(tokenBalances[tokenSymbol]?.value || 0) == 0}
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

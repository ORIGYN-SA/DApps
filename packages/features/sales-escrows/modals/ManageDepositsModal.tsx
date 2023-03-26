import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@dapp/features-authentication';
import { Container, Flex, Modal, Button, HR } from '@origyn/origyn-art-ui';
import { getBalanceByAccount, useTokensContext } from '@dapp/features-tokens-provider';
import { Principal } from '@dfinity/principal';
import { LoadingContainer } from '@dapp/features-components';
import { useDebug } from '@dapp/features-debug-provider';
import { useUserMessages } from '@dapp/features-user-messages';
import { toLargerUnit } from '@dapp/utils';
import { ERROR } from '../constants';


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
                fee: BigInt(activeTokens[token]?.fee),
                decimals: BigInt(activeTokens[token]?.decimals),
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
        showErrorMessage(`${'Withdraw of '}${toLargerUnit(BigInt(tokenBalances[token].value),BigInt(activeTokens[token]?.decimals))}${' '}${activeTokens[token]?.symbol}${' was unsuccessfull'}`, withdrawResp.err);
      } else {
        showSuccessMessage(`${'Withdraw of '}${toLargerUnit(BigInt(tokenBalances[token].value),BigInt(activeTokens[token]?.decimals))}${' '}${activeTokens[token]?.symbol}${' was successfull'}`);
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
        showErrorMessage(ERROR.tokenSaleInfoRetrieval, result.err);
        return;
      } else {
        const accountId = 'deposit_info' in result.ok ? result.ok.deposit_info.account_id_text : '';
        const balances = Object.keys(activeTokens).map(async (tokenSymbol) => {
          const val = await getBalanceByAccount(false, accountId, activeTokens[tokenSymbol]);
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
      showUnexpectedErrorMessage(e);
    }
  };

  useEffect(() => {
    if (actor) {
      getDepositInfo();
    }
  }, [open, actor]);

  return (
    <div>
      <Modal isOpened={open} closeModal={() => handleClose(false)} size="md">
        <Container size="full" padding="48px">
          <h3>Manage Token Deposits</h3>
          <HR marginTop={16} marginBottom={16} />
          {isLoading ? (
            <>
              <LoadingContainer />
            </>
          ) : (
            <>
              {Object.keys(activeTokens).map((tokenSymbol) => {
                return (
                  <div key={tokenSymbol} style={{ marginBottom: '16px' }}>
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
                          ).toFixed()}
                        </span>
                      </Flex>
                      <Button
                        btnType="filled"
                        size="small"
                        onClick={() => withdraw(tokenSymbol)}
                        disabled={(tokenBalances[tokenSymbol]?.value || 0) == 0}
                      >
                        Withdraw
                      </Button>
                    </Flex>
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

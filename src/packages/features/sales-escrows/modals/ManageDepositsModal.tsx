import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@dapp/features-authentication';
import { PerpetualOSContext } from '@dapp/features-context-provider';
import { Container, Flex, Modal, Button, HR } from '@origyn/origyn-art-ui';
import { getBalanceByAccount, useTokensContext } from '@dapp/features-tokens-provider';
import { LoadingContainer } from '@dapp/features-components';
import { useDebug } from '@dapp/features-debug-provider';
import { useUserMessages } from '@dapp/features-user-messages';
import { toLargerUnit } from '@dapp/utils';
import { ERROR } from '../constants';
import { Principal } from '@dfinity/principal';

const ManageDepositsModal = ({ open, handleClose }: any) => {
  const debug = useDebug();
  const { principal, actor } = useContext(AuthContext);
  const { showErrorMessage, showSuccessMessage, showUnexpectedErrorMessage } = useUserMessages();
  const [isLoading, setIsLoading] = useState(false);
  const [tokenBalances, setTokenBalances] = useState<any>({});
  const { activeTokens, refreshAllBalances } = useTokensContext();
  const context = useContext(PerpetualOSContext);
  const principalId = Principal.fromText(context.canisterId);

  const withdraw = async (token) => {
    if (principal && refreshAllBalances && actor) {
      try {
        setIsLoading(true);

        const withdrawResp = await actor.sale_nft_origyn({
          withdraw: {
            deposit: {
              token: {
                ic: {
                  id: [],
                  fee: [BigInt(activeTokens[token]?.fee || 0)],
                  decimals: BigInt(activeTokens[token]?.decimals || 0),
                  canister: activeTokens[token]?.canisterId,
                  standard: token === 'OGY' ? { ICRC1: null } : { Ledger: null },
                  symbol: activeTokens[token]?.symbol || '',
                },
              },
              withdraw_to: { principal },
              buyer: { principal },
              amount: BigInt(tokenBalances[token].value),
            },
          },
        });
        if ('err' in withdrawResp && activeTokens[token]?.decimals) {
          showErrorMessage(
            `${'Withdraw of '}${toLargerUnit(
              BigInt(tokenBalances[token].value),
              BigInt(activeTokens[token]?.decimals),
            )}${' '}${activeTokens[token]?.symbol}${' was unsuccessfull'}`,
            withdrawResp.err,
          );
        } else if (activeTokens[token]?.decimals) {
          showSuccessMessage(
            `${'Withdraw of '}${toLargerUnit(
              BigInt(tokenBalances[token].value),
              BigInt(activeTokens[token]?.decimals),
            )}${' '}${activeTokens[token]?.symbol}${' was successfull'}`,
          );
        }
      } catch (e) {
        showUnexpectedErrorMessage(e);
      } finally {
        setIsLoading(false);
        await getDepositInfo();
        refreshAllBalances(principal);
      }
    }
  };

  const getDepositInfo = async () => {
    if (principal) {
      try {
        const result = await actor?.sale_info_nft_origyn({
          deposit_info: [{ principal }],
        });
        debug.log('sale_info_nft_origyn result', result);

        if (result === undefined) {
          showErrorMessage(ERROR.tokenSaleInfoRetrieval, 'Result is undefined');
          return;
        }

        if ('err' in result) {
          showErrorMessage(ERROR.tokenSaleInfoRetrieval, result.err);
          return;
        } else {
          const accountId =
            'deposit_info' in result.ok ? result.ok.deposit_info.account_id_text : '';

          const balances = Object.keys(activeTokens).map(async (tokenSymbol) => {
            const val = await getBalanceByAccount(
              context.isLocal,
              accountId,
              activeTokens[tokenSymbol],
              principalId,
            );
            return { [tokenSymbol]: val };
          });
          Promise.all(Object.values(balances)).then((values) => {
            const b = values.reduce(
              (obj, item) =>
                Object.assign(obj, {
                  [Object.keys(item)[0]]: Object.values(item)[0],
                }),
              {},
            );
            setTokenBalances(b);
          });
        }
      } catch (e) {
        showUnexpectedErrorMessage(e);
      }
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
              {Object.keys(activeTokens)

                .filter(
                  (tokenSymbol) =>
                    tokenBalances[tokenSymbol]?.value && tokenBalances[tokenSymbol]?.decimals,
                )
                .map((tokenSymbol) => {
                  console.log(activeTokens[tokenSymbol]);
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
                              tokenBalances[tokenSymbol].value,
                              activeTokens[tokenSymbol]?.decimals || 0,
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

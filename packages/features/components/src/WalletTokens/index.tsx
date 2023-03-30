import React, { useContext, useState } from 'react';
import { AuthContext } from '@dapp/features-authentication';
import { useSnackbar } from 'notistack';
import { useTokensContext } from '@dapp/features-tokens-provider';
import { IdlStandard, isLocal } from '@dapp/utils';
import { TokenIcon } from '../TokenIcon';
import { LoadingContainer } from '../LoadingContainer';
import {
  Button,
  Card,
  CheckboxInput,
  Container,
  Flex,
  Modal,
  Select,
  TabContent,
  TextInput,
} from '@origyn/origyn-art-ui';

export const WalletTokens = ({ children }: any) => {
  const { principal } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // const [selectedTab, setSelectedTab] = useState<number>(0)
  const [selectedStandard, setSelectedStandard] = useState<string>(IdlStandard.DIP20.toString());
  const [inputCanisterId, setInputCanisterId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { addToken, toggleToken, tokens, refreshAllBalances } = useTokensContext();
  const { enqueueSnackbar } = useSnackbar();
  const handleAddButton = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const tokenResponse = await addToken(
      isLocal(),
      inputCanisterId,
      IdlStandard[selectedStandard],
      principal,
    );
    if (typeof tokenResponse !== 'string') {
      enqueueSnackbar(`You have successfully added token ${tokenResponse.symbol}.`, {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
    } else {
      enqueueSnackbar(tokenResponse, {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
    }
    setIsLoading(false);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
    refreshAllBalances(isLocal(), principal);
  };
  // const handleTabChange = (event: React.SyntheticEvent, tab: number) => {
  //   setSelectedTab(tab)
  // }
  const onTokenCheck = (symbol: string) => {
    toggleToken(symbol);
  };
  // const a11yProps = (index: number) => ({
  //   id: `simple-tab-${index}`,
  //   'aria-controls': `simple-tabpanel-${index}`,
  // });

  return (
    <>
      <Modal isOpened={isModalOpen} closeModal={() => handleModalClose()} size="md">
        <Container size="full" padding="48px">
          <h2>Manage Tokens</h2>
          <br />
          <TabContent
            fullWidth
            borderBottom
            tabs={[
              { title: 'Current Tokens', id: 'Current Tokens' },
              { title: 'Custom Token', id: 'Custom Token' },
            ]}
            content={[
              <Flex flexFlow="column" gap={18} fullWidth key="tabContentCol1">
                <br />
                {Object.keys(tokens).map((key: string) => {
                  const token = tokens[key];
                  // const labelId = `checkbox-list-secondary-label-${token.symbol}`;
                  return (
                    <Card
                      key={`${token.symbol}-${token.enabled}`}
                      justify="space-between"
                      align="center"
                      padding="16px"
                    >
                      <Flex gap={8} align="center">
                        <CheckboxInput
                          name={token.symbol}
                          onChange={() => onTokenCheck(token.symbol)}
                          checked={token.enabled}
                        />
                        <TokenIcon symbol={token.icon} />
                        <b>{token.symbol}</b>
                      </Flex>
                      <div>{token.balance}</div>
                    </Card>
                  );
                })}
              </Flex>,
              <Flex flexFlow="column" gap={18} fullWidth key="tabContentCol2">
                <br />
                <TextInput
                  id="standard-helperText"
                  label="Canister Id"
                  value={inputCanisterId}
                  onChange={(e) => setInputCanisterId(e.target.value)}
                  required
                />
                <Select
                  label="Token Standard"
                  handleChange={(option) => {
                    setSelectedStandard(option.value);
                  }}
                  options={Object.keys(IdlStandard)
                    .filter((standard) => isNaN(parseInt(standard)))
                    .map((standard) => ({
                      value: standard,
                      label: standard,
                    }))}
                />
                <Flex justify="flex-end">
                  {/* Disable until cusstom tokens are implemented */}
                  <Button btnType="outlined" disabled onClick={handleAddButton}>
                    Add token
                  </Button>
                </Flex>
              </Flex>,
            ]}
          />
          {isLoading && <LoadingContainer margin="16px" />}
        </Container>
      </Modal>
      <Button btnType="outlined" onClick={handleModalOpen}>
        {children}
      </Button>
    </>
  );
};

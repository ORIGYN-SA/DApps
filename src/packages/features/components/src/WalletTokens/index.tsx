import React, { useContext, useState } from "react";
import { AuthContext } from "@dapp/features-authentication";
import { useSnackbar } from "notistack";
import { useTokensContext } from "@dapp/features-tokens-provider";
import { IdlStandard } from "@dapp/utils";
import { TokenIcon } from "../TokenIcon";
import { LoadingContainer } from "@dapp/features-components";
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
} from "@origyn/origyn-art-ui";
import { Principal } from "@dfinity/principal";

export const WalletTokens = ({ children }: any) => {
  const { principal } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedStandard, setSelectedStandard] = useState<string>(
    IdlStandard.DIP20.toString()
  );
  const [inputCanisterId, setInputCanisterId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    addToken,
    toggleToken,
    tokens,
    refreshAllBalances,
    isFetchingBalance,
  } = useTokensContext();
  const { enqueueSnackbar } = useSnackbar();
  const handleAddButton = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (addToken && principal) {
        const tokenResponse = await addToken(
          Principal.fromText(inputCanisterId),
          IdlStandard[selectedStandard],
          principal
        );
        if (typeof tokenResponse !== "string") {
          enqueueSnackbar(
            `You have successfully added token ${tokenResponse.symbol}.`,
            {
              variant: "success",
              anchorOrigin: {
                vertical: "top",
                horizontal: "right",
              },
            }
          );
        } else {
          enqueueSnackbar(tokenResponse, {
            variant: "error",
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
          });
        }
      }
    } catch (error) {
      enqueueSnackbar("An error occurred while adding the token.", {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
    if (refreshAllBalances && principal) {
      refreshAllBalances(principal);
    } else {
      console.error("Failed to refresh all balances");
    }
  };
  // const handleTabChange = (event: React.SyntheticEvent, tab: number) => {
  //   setSelectedTab(tab)
  // }
  const onTokenCheck = (symbol: string) => {
    if (toggleToken && principal) {
      toggleToken(symbol);
    } else {
      console.error("Failed to toggle token");
    }
  };
  // const a11yProps = (index: number) => ({
  //   id: `simple-tab-${index}`,
  //   'aria-controls': `simple-tabpanel-${index}`,
  // });

  return (
    <>
      <Modal
        isOpened={isModalOpen}
        closeModal={() => handleModalClose()}
        size="md"
      >
        <Container size="full" padding="48px">
          <h2>Manage Tokens</h2>
          <br />
          <TabContent
            fullWidth
            borderBottom
            tabs={[
              { title: "Current Tokens", id: "Current Tokens" },
              { title: "Custom Token", id: "Custom Token" },
            ]}
            content={[
              <Flex flexFlow="column" gap={18} fullWidth key="tabContentCol1">
                <br />
                {tokens ? (
                  <>
                    {Object.keys(tokens).map((key: string) => {
                      const token = tokens[key];
                      return (
                        <Card
                          key={`${token.symbol}-${token.enabled}`}
                          justify="space-between"
                          align="center"
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
                          <div>
                            {isFetchingBalance ? "Loading" : token.balance}
                          </div>
                        </Card>
                      );
                    })}
                  </>
                ) : (
                  <LoadingContainer margin="24px" />
                )}
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

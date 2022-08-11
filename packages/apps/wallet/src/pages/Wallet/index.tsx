import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material';
import Link from '@mui/material/Link';
import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useState } from 'react';
import {
  TabPanel,
  TokenIcon,
  Table,
  NatPrice,
  LoadingContainer,
} from '@dapp/features-components';
import { AuthContext } from '@dapp/features-authentication';
import { useTokensContext } from '@dapp/features-tokens-provider';
import { timeConverter } from '@dapp/utils';
import {
  ConfirmSalesActionModal,
  StartAuctionModal,
} from '@dapp/features-sales-escrows';

const GuestContainer = () => {
  const { logIn } = useContext(AuthContext);

  return (
    <Box
      component="main"
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexGrow: 1,
        minHeight: '100%',
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography align="center" color="textPrimary" variant="h2">
            Welcome to the NFT Wallet!
          </Typography>
          <Typography align="center" color="textPrimary" variant="subtitle2">
            Connect to your wallet using a Chrome extension for Plug.
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <img
              alt="Under development"
              src="/public/nfts.jpeg"
              style={{
                marginTop: 30,
                marginBottom: 30,
                display: 'inline-block',
                maxWidth: '100%',
                width: 500,
                borderRadius: 5,
              }}
            />
          </Box>
          <Button
            onClick={() => logIn('plug')}
            startIcon={<AccountBalanceWalletIcon fontSize="small" />}
            variant="contained"
          >
            Connect wallet
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

const WalletPage = () => {
  const activeSalesColumns = [
    { id: 'token_id', label: 'Token ID' },
    { id: 'sale_id', label: 'Sale ID' },
    { id: 'symbol', label: 'Token' },
    { id: 'start_price', label: 'Start Price' },
    { id: 'buy_now', label: 'Buy Now' },
    { id: 'highest_bid', label: 'Highest Bid' },
    { id: 'end_date', label: 'End Date' },
    { id: 'actions', label: 'Actions' },
  ];
  const { loggedIn, tokenId, canisterId, principal, actor } = useContext(AuthContext);

  const [openAuction, setOpenAuction] = React.useState(false);
  const [openConfirmation, setOpenConfirmation] = React.useState(false);
  const [selectdNFT, setSelectdNFT] = React.useState<any>();
  const [selectedEscrow, setSelectedEscrow] = useState<any>();
  const [NFTData, setNFTData] = useState<any>();
  const [activeEscrows, setActiveEscrows] = useState<any>();
  const [dialogAction, setDialogAction] = useState<any>();
  const [activeSales, setActiveSales] = useState<any>({
    columns: activeSalesColumns,
  });
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnlyTokenEntries, setShowOnlyTokenEntries] = useState(true);

  const { enqueueSnackbar } = useSnackbar();
  const { tokens } = useTokensContext();

  const handleClickOpen = (item, modal = 'auction') => {
    setSelectdNFT(item.metadata);
    if (modal === 'auction') setOpenAuction(true);
    else if (modal === 'confirmEnd') {
      setOpenConfirmation(true);
      setDialogAction('endSale');
    }
  };

  const handleClose = async (dataChanged = false) => {
    setOpenAuction(false);
    setOpenConfirmation(false);
    if (dataChanged) {
      fetchData();
    }
  };


  const pushNotification = (message, variant) => {
    enqueueSnackbar(message, {
      variant,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
    });
  };
  
  const createTableData = (data) => {
    const columns = [
      { id: 'id', label: 'id' },
      { id: 'preview', label: 'Preview' },
      { id: 'sale', label: 'Active Sale' },
      { id: 'saleStatus', label: 'Sale Status' },
      { id: 'actions', label: 'Actions' },
    ];

    const rows = data?.map((item) => {
      const rows: any = {};
      item?.metadata?.Class?.map((meta) => {
        if (!meta.name.startsWith('__')) {
          if (meta?.value?.Text || meta?.value?.Principal) {
            rows[meta.name] = meta?.value?.Text ?? meta?.value?.Principal.toText();
          }
        }
      });

      const sale_type = item?.current_sale.length > 0 ? item?.current_sale[0].sale_type : {};
      rows.sale = (
        <Tooltip title={item?.current_sale[0]?.sale_id}>
          <p>{item?.current_sale[0]?.sale_id?.substring(0, 8)}...</p>
        </Tooltip>
      ) || 'No sales';
      rows.raw_id = rows.id;
      rows.id = <Link href={`#/${rows.id}`}>{rows.id}</Link>;
      rows.preview = (
        <img
          src={`https://${canisterId}.raw.ic0.app/-/${rows.raw_id}`}
          style={{ height: '50px', borderRadius: '5px' }}
        />
      );
      rows.saleStatus = Object.keys(sale_type?.auction?.status || {})[0] || 'No sales';

      const isAuctionStarted = !sale_type?.auction?.status?.hasOwnProperty('closed')
        && sale_type?.auction;
      // @ts-ignore
      rows.actions = isAuctionStarted ? (
        <span style={{ color: 'orange' }}>AUCTION STARTED</span>
      ) : (
        <Button onClick={() => handleClickOpen(item)}>Start Auction</Button>
      );
      return rows;
    });

    return { rows, columns: columns.filter((column) => column) };
  };

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const withdrawEscrow = async (escrow) => {
    setOpenConfirmation(true);
    setSelectedEscrow(escrow);
    setDialogAction('withdraw');
  };

  const rejectEscrow = async (escrow) => {
    setOpenConfirmation(true);
    setSelectedEscrow(escrow);
    setDialogAction('reject');
  };

  const fetchData = () => {
    if (actor && principal) {
      setIsLoading(true);
      actor
        ?.balance_of_nft_origyn({ principal })
        .then((response) => {
          const escrows = response?.ok?.escrow;
          const offers = response?.ok?.offers;
          const inEscrow: any = [];
          const outEscrow: any = [];
          if (escrows) {
            escrows.forEach((escrow, index) => {
              const esc: any = {};
              esc.token_id = escrow.token_id;
              esc.actions = (
                <Button
                  onClick={() => withdrawEscrow(response?.ok?.escrow[index])}
                  variant="contained"
                >
                  Withdraw
                </Button>
              );
              esc.symbol = (
                <>
                  <TokenIcon symbol={tokens[escrow?.token?.ic?.symbol]?.icon} />
                  {escrow?.token?.ic?.symbol}
                </>
              );
              esc.buyer = (
                <Tooltip title={escrow.buyer.principal.toText()}>
                  <p>{escrow.buyer.principal.toText().substring(0, 8)}...</p>
                </Tooltip>
              );
              esc.seller = (
                <Tooltip title={escrow.seller.principal.toText()}>
                  <p>{escrow.seller.principal.toText().substring(0, 8)}...</p>
                </Tooltip>
              );
              // esc.lockDate =
              //   escrow?.lock_to_date?.length > 0
              //     ? timeConverter(BigInt(parseInt(escrow?.lock_to_date[0]) * 1e9))
              //     : "-";

              esc.amount = parseFloat(
                (parseInt(escrow.amount) * 1e-8).toString(),
              ).toFixed(9);
              outEscrow.push(esc);
            });
          }
          if (offers) {
            offers.forEach((offer, index) => {
              const esc: any = {};
              esc.token_id = offer.token_id;
              esc.actions = (
                <Button
                  onClick={() => rejectEscrow(response?.ok?.offers[index])}
                  variant="contained"
                >
                  Reject
                </Button>
              );
              esc.symbol = (
                <>
                  <TokenIcon symbol={tokens[offer?.token?.ic?.symbol]?.icon} />
                  {offer?.token?.ic?.symbol}
                </>
              );
              esc.buyer = (
                <Tooltip title={offer.buyer.principal.toText()}>
                  <p>{offer.buyer.principal.toText().substring(0, 8)}...</p>
                </Tooltip>
              );
              esc.seller = (
                <Tooltip title={offer.seller.principal.toText()}>
                  <p>{offer.seller.principal.toText().substring(0, 8)}...</p>
                </Tooltip>
              );
              // esc.lockDate =
              //   escrow?.lock_to_date?.length > 0
              //     ? timeConverter(BigInt(parseInt(escrow?.lock_to_date[0]) * 1e9))
              //     : "-";

              esc.amount = parseFloat(
                (parseInt(offer.amount) * 1e-8).toString(),
              ).toFixed(9);
              inEscrow.push(esc);
            });
          }
          const inColumns = [
            { id: 'token_id', label: 'Id' },
            { id: 'buyer', label: 'Buyer' },
            { id: 'symbol', label: 'Token' },
            { id: 'amount', label: 'Amount' },
            { id: 'lockDate', label: 'Lock Date' },
            { id: 'actions', label: 'Actions' },
          ];
          const outColumns = [
            { id: 'token_id', label: 'Id' },
            { id: 'seller', label: 'Seller' },
            { id: 'symbol', label: 'Token' },
            { id: 'amount', label: 'Amount' },
            { id: 'lockDate', label: 'Lock Date' },
            { id: 'actions', label: 'Actions' },
          ];
          setActiveEscrows({
            in: { columns: inColumns, data: inEscrow },
            out: { columns: outColumns, data: outEscrow },
          });

          Promise.all(
            response?.ok?.nfts?.map((nft) => actor?.nft_origyn(nft).then((r) => r.ok)),
          )
            .then((data: any) => {
              const rows = [];
              for (const item of data) {
                for (const sale of item.current_sale) {
                  console.log(sale);
                  const { start_price, buy_now, token, ending } = sale?.sale_type?.auction?.config?.auction || {};
                  const { status, current_bid_amount } = sale?.sale_type?.auction || {};

                  if (!status?.hasOwnProperty('closed')) {
                    rows.push({
                      key: sale.token_id,
                      token_id: sale.token_id,
                      sale_id: (
                        <Tooltip title={sale.sale_id}>
                          <p>{sale.sale_id.substring(0, 8)}...</p>
                        </Tooltip>
                      ),

                      symbol: (
                        <>
                          <TokenIcon symbol={tokens[token?.ic?.symbol]?.icon} />
                          {token?.ic?.symbol}
                        </>
                      ),
                      start_price: <NatPrice value={start_price} />,
                      buy_now: <NatPrice value={buy_now[0] ?? 0} />,
                      highest_bid: <NatPrice value={current_bid_amount} />,
                      end_date: timeConverter(BigInt(ending.date)),
                      actions:
                        ~~(Date.now() * 1e6) > parseInt(ending.date) ? (
                          <Button
                            onClick={() => handleClickOpen(item, 'confirmEnd')}
                          >
                            End Sale
                          </Button>
                        ) : (
                          '-'
                        ),
                    });
                  }
                }
              }

              setActiveSales((prev) => ({ columns: prev.columns, rows }));
              setIsLoading(false);
              setNFTData(createTableData(data));
            })
            .catch((err) => {
              setIsLoading(false);
              console.log(err);
            });
        });
    }
  };

  useEffect(() => {
    fetchData();
  }, [actor, principal]);

  const FilteredNFTData = tokenId && showOnlyTokenEntries
    ? NFTData?.rows?.filter((nft) => nft.raw_id === tokenId)
    : NFTData?.rows;

  const FilteredActiveSales = tokenId && showOnlyTokenEntries
    ? activeSales?.rows?.filter((nft) => nft.token_id === tokenId)
    : activeSales?.rows;

  const FilteredActiveEscrowsIn = tokenId && showOnlyTokenEntries
    ? activeEscrows?.in?.data?.filter((nft) => nft.token_id === tokenId)
    : activeEscrows?.in?.data;

  const FilteredActiveEscrowsOut = tokenId && showOnlyTokenEntries
    ? activeEscrows?.out?.data?.filter((nft) => nft.token_id === tokenId)
    : activeEscrows?.out?.data;

  console.log(NFTData);
  return (
    <>
      {loggedIn ? (
        <div>
          <Box
            display="flex"
            flexDirection="column"
            flex-wrap="wrap"
            style={{ marginLeft: '1.5rem' }}
          >
            <p>
              Hello: <b>{principal?.toText()}</b>
            </p>
            <p>
              Canister ID: <b>{canisterId}</b>
            </p>
            <p>
              Token(NFT) ID: <b>{tokenId}</b>
            </p>
          </Box>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <ConfirmSalesActionModal
              open={openConfirmation}
              handleClose={handleClose}
              currentToken={selectdNFT}
              action={dialogAction}
              escrow={selectedEscrow}
            />
            {tokenId && (
              <FormControlLabel
                style={{ float: 'right' }}
                control={(
                  <Checkbox
                    checked={showOnlyTokenEntries}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShowOnlyTokenEntries(e.target.checked)}
                  />
                )}
                label={(
                  <>
                    Show only entries for <b>{tokenId}</b>
                  </>
                )}
              />
            )}
            <Tabs
              value={selectedTab}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="My NFTs" {...a11yProps(0)} />
              <Tab label="Active Sales" {...a11yProps(1)} />
              <Tab label="Active Escrows" {...a11yProps(2)} />
              {/* <Tab label="TEST: Create & Mint NFT" {...a11yProps(3)} />
              <Tab label="TEST: Create Transaction" {...a11yProps(4)} /> */}
            </Tabs>
          </Box>
          <TabPanel value={selectedTab} index={0}>
            {isLoading ? (
              <LoadingContainer />
            ) : NFTData?.rows?.length > 0 && NFTData?.columns ? (
              <Table columns={NFTData.columns} rows={FilteredNFTData} />
            ) : (
              <Typography variant="h5" style={{ textAlign: 'center' }}>
                You do not have any NFT in your wallet
              </Typography>
            )}
            <StartAuctionModal
              open={openAuction}
              handleClose={handleClose}
              currentToken={selectdNFT}
            />
          </TabPanel>
          <TabPanel value={selectedTab} index={1}>
            {isLoading ? (
              <LoadingContainer />
            ) : activeSales?.rows?.length > 0 ? (
              <Table columns={activeSales.columns} rows={FilteredActiveSales} />
            ) : (
              <Typography variant="h5" style={{ textAlign: 'center' }}>
                You do not have any active sale at this moment
              </Typography>
            )}
          </TabPanel>
          <TabPanel value={selectedTab} index={2}>
            {isLoading ? (
              <LoadingContainer />
            ) : activeEscrows?.in?.data?.length > 0
              || activeEscrows?.out?.data?.length > 0 ? (
                <>
                  {activeEscrows?.in?.data?.length > 0 && (
                  <div style={{ marginBottom: 5 }}>
                    Received escrows
                    <Table
                      columns={activeEscrows.in.columns}
                      rows={FilteredActiveEscrowsIn}
                    />
                  </div>
                  )}
                  {activeEscrows?.out?.data?.length > 0 && (
                  <>
                    Sent escrows
                    <Table
                      columns={activeEscrows.out.columns}
                      rows={FilteredActiveEscrowsOut}
                    />
                  </>
                  )}
                </>
              ) : (
                <Typography variant="h5" style={{ textAlign: 'center' }}>
                  You do not have any active escrow at this moment
                </Typography>
              )}
          </TabPanel>
          {/* <TabPanel value={selectedTab} index={3}>
            <div style={{ opacity: isLoading ? "0.4" : "1" }}>
              <Box
                component="form"
                autoComplete="off"
                style={{ marginBottom: 10 }}
              >
                <TextField
                  inputRef={tokenIdRef}
                  required
                  id="outlined-required"
                  label="Token ID"
                />
              </Box>
              <Button variant="outlined" onClick={createNFT}>
                Create NFT
              </Button>
              <Button
                variant="contained"
                onClick={mintNFT}
                style={{ marginLeft: 5 }}
              >
                Mint NFT
              </Button>
            </div>
            {isLoading && (
              <div style={{ marginTop: 5 }}>
                <LoadingContainer />
              </div>
            )}
          </TabPanel>
          <TabPanel value={selectedTab} index={4}>
            <Button onClick={createTransaction}>Create Transaction</Button>
          </TabPanel> */}
        </div>
      ) : (
        <GuestContainer />
      )}
    </>
  );
};

export default WalletPage;

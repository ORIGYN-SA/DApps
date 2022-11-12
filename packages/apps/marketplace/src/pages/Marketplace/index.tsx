import React from 'react';
import { ICPIcon, OGYIcon } from '@dapp/common-assets';
import { AuthContext, useRoute, useSessionContext } from '@dapp/features-authentication';
import { NatPrice } from '@dapp/features-components';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import GridViewIcon from '@mui/icons-material/GridView';
import PaidIcon from '@mui/icons-material/Paid';
import ViewComfyIcon from '@mui/icons-material/ViewComfy';
import {
  Card,
  CardContent,
  CardMedia,
  Collapse,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
// import { useSnackbar } from 'notistack';
import { useContext, useEffect, useState } from 'react';
import { isLocal } from '@dapp/utils';

const SymbolWithIcon = ({ symbol }: any) =>
  symbol === 'OGY' ? (
    <>
      <OGYIcon
        style={{
          verticalAlign: 'middle',
          width: '20px',
          height: '20px',
          marginRight: '3px',
          borderRadius: '25px',
          backgroundColor: 'black',
        }}
      />{' '}
      {symbol}
    </>
  ) : (
    <>
      <ICPIcon
        style={{
          verticalAlign: 'middle',
          width: '20px',
          height: '20px',
          marginRight: '3px',
          borderRadius: '25px',
          backgroundColor: 'black',
        }}
      />{' '}
      {symbol}
    </>
  );

const Marketplace = () => {
  const { localDevelopment } = useSessionContext();
  const { actor } = useContext(AuthContext);
  const [canisterId, setCanisterId] = useState('');
  const [NFTData, setNFTData] = useState<any>();
  const [filteredNFTs, setFilteredNFTs] = useState([]);
  //const [isLoading, setIsLoading] = useState(true);
  const [display, setDisplay] = useState(3);
  const [open, setOpen] = useState(false);
  const [openPrice, setOpenPrice] = useState(false);
  const [onSale, setOnSale] = useState(true);
  const [minPrice, setMinPrice] = useState<any>(0);
  const [maxPrice, setMaxPrice] = useState<any>(0);

  const fetchData = () => {
    console.log(actor);
    if (actor) {
      //setIsLoading(true);
      actor?.collection_nft_origyn([]).then((response) => {
        console.log(response);

        Promise.all(
          response?.ok?.token_ids[0]?.map((nft) => actor?.nft_origyn(nft).then((r) => r.ok)),
        )
          .then((data: any) => {
            //setIsLoading(false);
            console.log(data);
            setNFTData(data);
          })
          .catch((err) => {
            //setIsLoading(false);
            console.log(err);
          });
      });
    }
  };

  useEffect(() => {
    useRoute().then(({ canisterId }) => {
      setCanisterId(canisterId);
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, [actor]);

  useEffect(() => {
    const tmpFiltered = [...(NFTData || [])];
    console.log(tmpFiltered);
    const filtered = tmpFiltered.filter((item) => {
      if (onSale) {
        const currentOpenAuction = item?.current_sale?.find((sale) =>
          sale?.sale_type?.auction?.status?.hasOwnProperty('open'),
        );
        console.log(currentOpenAuction);
        return currentOpenAuction;
      }
      return true;
    });
    // console.log(filtered);
    setFilteredNFTs(filtered);
  }, [onSale, minPrice, maxPrice, NFTData]);

  return (
    <div>
      <Grid
        container
        sx={{
          borderTop: '1px solid #aaaaaa',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Grid container item xs={12} md={3} sx={{ borderRight: '1px solid #aaaaaa' }}>
          <List sx={{ width: '100%' }}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <FilterListIcon />
                </ListItemIcon>
                <ListItemText primary="Filters" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding onClick={() => setOpenPrice(!openPrice)}>
              <ListItemButton>
                <ListItemIcon>
                  <PaidIcon />
                </ListItemIcon>
                <ListItemText primary="Price" />
                {openPrice ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>

            <Collapse in={openPrice} timeout="auto" unmountOnExit>
              <ListItem>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      id="outlined-basic"
                      label="Min Price"
                      variant="outlined"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      id="outlined-basic"
                      label="Max Price"
                      variant="outlined"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </ListItem>
            </Collapse>
            <ListItem disablePadding onClick={() => setOpen(!open)}>
              <ListItemButton>
                <ListItemIcon>
                  <FilterListIcon />
                </ListItemIcon>
                <ListItemText primary="Sale Token" />
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 2 }}>
                  <ListItemIcon>
                    <OGYIcon />
                  </ListItemIcon>
                  <ListItemText primary="OGY" />
                </ListItemButton>
                <ListItemButton sx={{ pl: 2 }}>
                  <ListItemIcon>
                    <ICPIcon />
                  </ListItemIcon>
                  <ListItemText primary="ICP" />
                </ListItemButton>
              </List>
            </Collapse>
          </List>
        </Grid>
        <Grid item xs={12} md={9} sx={{ padding: '10px' }}>
          <Grid container spacing={2}>
            <Grid item>
              <ToggleButtonGroup size="large">
                <ToggleButton value="left" key="left" onClick={() => setDisplay(3)}>
                  <ViewComfyIcon />
                </ToggleButton>
                <ToggleButton value="left" key="left" onClick={() => setDisplay(2)}>
                  <GridViewIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            <Grid item>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-label">Showing</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Age"
                  value={onSale ? '0' : '1'}
                  onChange={(e) => setOnSale(e.target.value === '0')}
                >
                  <MenuItem value="0">On sale</MenuItem>
                  <MenuItem value="1">All NFTs</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
                <Select labelId="demo-simple-select-label" id="demo-simple-select" label="Age">
                  <MenuItem value="0">Price: Low to High</MenuItem>
                  <MenuItem value="1">Price: High to Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            {filteredNFTs?.map((nft, index) => {
              const nftID = nft.metadata.Class.find(({ name }) => name === 'id').value.Text;
              return (
                <Grid item xs={12} md={display} key={`${nft}+${index}`}>
                  <Link href={`#/${nftID}`}>
                    <Card variant="outlined">
                      <CardMedia
                        component="img"
                        image={
                          isLocal() && localDevelopment
                            ? `http://${canisterId}.localhost:8000/-/${nftID}/preview`
                            : `https://${canisterId}.raw.ic0.app/-/${nftID}/preview`
                        }
                        alt={nftID}
                      />
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">
                          NFT id: {nftID} <br />
                        </Typography>
                        <Typography>
                          Token:{' '}
                          <SymbolWithIcon
                            symbol={
                              nft?.current_sale[0]?.sale_type?.auction?.config?.auction?.token?.ic
                                ?.symbol
                            }
                          />
                        </Typography>
                        <Typography>
                          Start price:{' '}
                          <strong>
                            <NatPrice
                              value={
                                nft?.current_sale[0]?.sale_type?.auction?.config?.auction
                                  ?.start_price
                              }
                            />
                          </strong>
                        </Typography>
                        <Typography>
                          Minimum step:{' '}
                          <strong>
                            <NatPrice
                              value={
                                nft?.current_sale[0]?.sale_type?.auction?.config?.auction
                                  ?.min_increase?.amount
                              }
                            />
                          </strong>
                        </Typography>
                        <Typography>
                          Highest bid:{' '}
                          <strong>
                            <NatPrice
                              value={nft?.current_sale[0]?.sale_type?.auction?.current_bid_amount}
                            />
                          </strong>
                        </Typography>
                        {nft?.current_sale[0]?.sale_type?.auction?.config?.auction?.buy_now
                          ?.length > 0 && (
                          <Typography>
                            Buy now:{' '}
                            <strong>
                              <NatPrice
                                value={
                                  nft?.current_sale[0]?.sale_type?.auction?.config?.auction
                                    ?.buy_now[0]
                                }
                              />
                            </strong>
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Marketplace;

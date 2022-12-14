import React, { useContext, useEffect, useState } from 'react';
import { timeConverter } from '@dapp/utils';
import { AuthContext } from '@dapp/features-authentication';
import { IconButton } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import ArrowDownwardOutlinedIcon from '@mui/icons-material/ArrowDownwardOutlined';
// Import Interfaces TS
import { Transactions, Row } from '@dapp/utils';
// Import fn to get the TransactionObj
import { Mint } from './functions/Mint';
import {AuctionBid}  from './functions/AuctionBid';
import { SaleEnded } from './functions/SaleEnded';
import { SaleOpened } from './functions/SaleOpened';
import { OwnerTransfer } from './functions/OwnerTransfer';
import { EscrowDeposit } from './functions/EscrowDeposit';
import { EscrowWithdraw } from './functions/EscrowWithdraw';
import { SaleWithdraw } from './functions/SaleWithdraw';
// mintjs
import { getNftHistory} from '@origyn-sa/mintjs';
// Modal Box - Component
import { Transaction } from '../TransactionModal';

import { Container, Modal} from '@origyn-sa/origyn-art-ui';

// Table style
const cell_style = {
  colSpan: '4',
  align: 'center',
  fontWeight: 'Bold',
};
// Style Modal Box
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: '600px',
  bgcolor: 'background.paper',
  border: '3px solid ',
  boxShadow: 24,
  p: 4,
  borderRadius: 0,
  borderImage: 'linear-gradient(to right,yellow 30%,red 50%,violet 70%, blue 80%, green 100%) 2',
};
// array without duplicates
function removeDuplicates(arr: string[]) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

export const TransactionsTable = (props: any) => {
  // Authcontext
  const { actor } = useContext(AuthContext);

  //* *STATUS OF THE OBJ WITH HISTORY **//
  // Is empty-
  const [isEmpty, setIsEmpty] = useState(false);

  //* *PAGINATION**//

  // Pagination number of rows
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  // Order of tnx-
  const [isReverse, setReverseOrder] = useState(true);
  // Change order of transactions
  const changeOrder = () => {
    if (isReverse) {
      setReverseOrder(false);
    } else {
      setReverseOrder(true);
    }
  };
  // N of rows per page
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  // N of page
  const [page, setPage] = React.useState(0);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  //* TABLE ROWS*/

  const [rowsArray, setRowsArray] = useState([]);

  //* *VALUES FOR SELECT */
  // Array with all types
  const [allTypes, setAllTypes] = React.useState([]);

  //* *MODAL BOX */
  // Modal Box Features
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('indexID')) {
      const cur_url = new URL(document.location.href);
      const search_params = cur_url.searchParams;
      search_params.delete('indexID');
      cur_url.search = search_params.toString();
      window.history.pushState(
        '',
        '',
        window.location.href.replace(window.location.href, cur_url.toString()),
      );
    }
    props.setIndexID('');
    setOpen(false);
  };
  const openModal = (event, key, obj_trans) => {
    // Loading
    setModalData('Loading...');
    for (const i in obj_trans) {
      if (obj_trans[i].trans_index == key) {
        // Setting data for the modal
        setModalData(obj_trans[i]);
        // Open the modal
        handleOpen();
        // Check if the tokenID is present
        const str = window.location.pathname.split('/');
        if (str.includes(props.searchBarTokenId)) {
          // Set url params with indexID
          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.has('indexID')) {
            console.log('Id is in URL');
          } else {
            const url = new URL(document.location.href);
            const search_params = url.searchParams;
            search_params.set('indexID', key);
            url.search = search_params.toString();
            window.history.pushState(
              '',
              '',
              window.location.href.replace(window.location.href, url.toString()),
            );
          }
        }
      }
    }
    props.setIndexID(key);
  };
  const [modalData, setModalData] = React.useState({});

  const getHistory = async () => {
    props.setIsLoading(true);
    setIsEmpty(true);
    props.setTrans_types(['Loading...']);
    // array for dynamyc Select values
    const select_vals = ['All types'];
    const array_with_all_types = ['All types'];
    const response = await getNftHistory(props.searchBarTokenId.toString());
    // response 2 string
    const string_history = JSON.stringify(
      response,
      (key, value) => (typeof value === 'bigint' ? value.toString() : value),
      2,
    );
    // parsing response
    const json_history = JSON.parse(string_history);

    // enter in the obj
    const historyNFT = json_history.ok;
    let x: string;
    let _props: string;

    // single transaction obj declaration
    let transactionObj: Transactions;
    function setTransData(i: any) {
      'use strict';
      return (y) => [...y, { ...i }];
    }
    // loop through all the obj
    for (x in historyNFT) {
      let _transaction_type_formatted: string = '';

      const _date_string = timeConverter(BigInt(historyNFT[x].timestamp));

      const enter_in_transaction = historyNFT[x].txn_type;

      const _indexTrans = historyNFT[x].index;

      const _token_id = historyNFT[x].token_id;

      for (_props in enter_in_transaction) {
        if (enter_in_transaction.hasOwnProperty(_props)) {
          // capitalize transaction
          const capitalized = _props.charAt(0).toUpperCase() + _props.slice(1);
          // replace _ with " "
          const replaced = capitalized.replace('_', ' ');
          _transaction_type_formatted += replaced;
          
          switch (_props) {
            case 'auction_bid':
              transactionObj = AuctionBid(
                enter_in_transaction,
                _props,
                transactionObj,
                historyNFT[x],
                _transaction_type_formatted,
              );
              if (props.indexID) {
                if (historyNFT[x].index.toString() == props.indexID) {
                  setModalData('Loading...');
                  setModalData(transactionObj);
                  handleOpen();
                }
              }
              props.setTransactionData(setTransData(transactionObj));

              break;
            case 'mint':
              transactionObj = Mint(
                enter_in_transaction,
                _props,
                transactionObj,
                historyNFT[x],
                _transaction_type_formatted,
              );
              
              if (props.indexID) {
                if (historyNFT[x].index.toString() == props.indexID) {
                  setModalData('Loading...');
                  setModalData(transactionObj);
                  handleOpen();
                }
              }
              props.setTransactionData(setTransData(transactionObj));
              break;
            case 'sale_ended':
              transactionObj = SaleEnded(
                enter_in_transaction,
                _props,
                transactionObj,
                historyNFT[x],
                _transaction_type_formatted,
              );
              if (props.indexID) {
                if (historyNFT[x].index.toString() == props.indexID) {
                  setModalData('Loading...');
                  setModalData(transactionObj);
                  handleOpen();
                }
              }
              props.setTransactionData(setTransData(transactionObj));
              break;
            case 'sale_opened':
              transactionObj = SaleOpened(
                enter_in_transaction,
                _props,
                transactionObj,
                historyNFT[x],
                _transaction_type_formatted,
              );
              if (props.indexID) {
                if (historyNFT[x].index.toString() == props.indexID) {
                  setModalData('Loading...');
                  setModalData(transactionObj);
                  handleOpen();
                }
              }
              props.setTransactionData(setTransData(transactionObj));

              break;
            case 'owner_transfer':
              transactionObj = OwnerTransfer(
                enter_in_transaction,
                _props,
                transactionObj,
                historyNFT[x],
                _transaction_type_formatted,
              );
              if (props.indexID) {
                if (historyNFT[x].index.toString() == props.indexID) {
                  setModalData('Loading...');
                  setModalData(transactionObj);
                  handleOpen();
                }
              }
              props.setTransactionData(setTransData(transactionObj));

              break;
            case 'escrow_deposit':
              transactionObj = EscrowDeposit(
                enter_in_transaction,
                _props,
                transactionObj,
                historyNFT[x],
                _transaction_type_formatted,
              );
              if (props.indexID) {
                if (historyNFT[x].index.toString() == props.indexID) {
                  setModalData('Loading...');
                  setModalData(transactionObj);
                  handleOpen();
                }
              }
              props.setTransactionData(setTransData(transactionObj));
              break;
            case 'escrow_withdraw':
              transactionObj = EscrowWithdraw(
                enter_in_transaction,
                _props,
                transactionObj,
                historyNFT[x],
                _transaction_type_formatted,
              );
              if (props.indexID) {
                if (historyNFT[x].index.toString() == props.indexID) {
                  setModalData('Loading...');
                  setModalData(transactionObj);
                  handleOpen();
                }
              }
              props.setTransactionData(setTransData(transactionObj));
              break;
            case 'sale_withdraw':
              transactionObj = SaleWithdraw(
                enter_in_transaction,
                _props,
                transactionObj,
                historyNFT[x],
                _transaction_type_formatted,
              );
              if (props.indexID) {
                if (historyNFT[x].index.toString() == props.indexID) {
                  setModalData('Loading...');
                  setModalData(transactionObj);
                  handleOpen();
                }
              }
              props.setTransactionData(setTransData(transactionObj));
              break;
          }
        }
      }
      array_with_all_types.push(transactionObj.type_txn);
      let return_all_rows = false;
      let found: number;
      let newRow: Row;

      if (props.filter.transactionType == '' || props.filter.transactionType == 'All types') {
        switch (props.filter.categoryToFilter) {
          case 'All':
            newRow = {
              index: _indexTrans,
              date: _date_string,
              id_token: _token_id,
              type_txn: _transaction_type_formatted,
            };
            setRowsArray((x) => [...x, { ...newRow }]);
            select_vals.push(transactionObj.type_txn);
            setIsEmpty(false);
            break;
          case 'Transaction Id':
            // If input is '' show all the rows
            if (props.filter.searchInputValue.toString().trim() == '') {
              return_all_rows = true;
            }
            if (transactionObj.trans_index == props.filter.searchInputValue.toString().trim()) {
              newRow = {
                index: _indexTrans,
                date: _date_string,
                id_token: _token_id,
                type_txn: _transaction_type_formatted,
              };
              setRowsArray((x) => [...x, { ...newRow }]);

              setIsEmpty(false);
            }
            break;
          case 'Token Id':
            // If input is '' show all the rows
            if (props.filter.searchInputValue.toString().trim() == '') {
              return_all_rows = true;
            }
            if (transactionObj.token_id == props.filter.searchInputValue.toString().trim()) {
              newRow = {
                index: _indexTrans,
                date: _date_string,
                id_token: _token_id,
                type_txn: _transaction_type_formatted,
              };
              setRowsArray((x) => [...x, { ...newRow }]);
              select_vals.push(transactionObj.type_txn);
              setIsEmpty(false);
            }
            break;
          case 'Principal':
            // If input is '' show all the rows
            if (props.filter.searchInputValue.toString().trim() == '') {
              return_all_rows = true;
            }
            found = transactionObj.principals.indexOf(
              props.filter.searchInputValue.toString().trim(),
            );
            if (found != -1) {
              newRow = {
                index: _indexTrans,
                date: _date_string,
                id_token: _token_id,
                type_txn: _transaction_type_formatted,
              };
              setRowsArray((x) => [...x, { ...newRow }]);
              select_vals.push(transactionObj.type_txn);
              setIsEmpty(false);
            }
            break;
          case 'Account':
            // If input is '' show all the rows
            if (props.filter.searchInputValue.toString().trim() == '') {
              return_all_rows = true;
            }
            found = transactionObj.accounts.indexOf(
              props.filter.searchInputValue.toString().trim(),
            );
            if (found != -1) {
              newRow = {
                index: _indexTrans,
                date: _date_string,
                id_token: _token_id,
                type_txn: _transaction_type_formatted,
              };
              setRowsArray((x) => [...x, { ...newRow }]);
              select_vals.push(transactionObj.type_txn);

              setIsEmpty(false);
            }

            break;
        }
      } else {
        switch (props.filter.categoryToFilter) {
          case 'All':
            if (transactionObj.type_txn == props.filter.transactionType) {
              newRow = {
                index: _indexTrans,
                date: _date_string,
                id_token: _token_id,
                type_txn: _transaction_type_formatted,
              };
              setRowsArray((x) => [...x, { ...newRow }]);
              if (props.filter.update == 0) {
                var i;
                for (i in allTypes) {
                  const type = allTypes[i];
                  select_vals.push(type);
                }
              } else {
                select_vals.push(transactionObj.type_txn);
              }
              setIsEmpty(false);
            }
            break;
          case 'Transaction Id':
            if (props.filter.searchInputValue == '') {
              if (transactionObj.type_txn == props.filter.transactionType) {
                newRow = {
                  index: _indexTrans,
                  date: _date_string,
                  id_token: _token_id,
                  type_txn: _transaction_type_formatted,
                };
                setRowsArray((x) => [...x, { ...newRow }]);
                select_vals.push(transactionObj.type_txn);
                setIsEmpty(false);
              }
            } else if (
              transactionObj.trans_index == props.filter.searchInputValue.toString().trim() &&
              transactionObj.type_txn == props.filter.transactionType
            ) {
              newRow = {
                index: _indexTrans,
                date: _date_string,
                id_token: _token_id,
                type_txn: _transaction_type_formatted,
              };
              setRowsArray((x) => [...x, { ...newRow }]);
              select_vals.push(transactionObj.type_txn);
              setIsEmpty(false);
            } else {
              select_vals.push('');
            }

            break;
          case 'Principal':
            if (props.filter.searchInputValue == '') {
              if (
                transactionObj.principals.length > 0 &&
                transactionObj.type_txn == props.filter.transactionType
              ) {
                newRow = {
                  index: _indexTrans,
                  date: _date_string,
                  id_token: _token_id,
                  type_txn: _transaction_type_formatted,
                };
                setRowsArray((x) => [...x, { ...newRow }]);
                select_vals.push(transactionObj.type_txn);
                setIsEmpty(false);
              }
            } else {
              found = transactionObj.principals.indexOf(
                props.filter.searchInputValue.toString().trim(),
              );
              if (transactionObj.type_txn == props.filter.transactionType && found != -1) {
                newRow = {
                  index: _indexTrans,
                  date: _date_string,
                  id_token: _token_id,
                  type_txn: _transaction_type_formatted,
                };
                setRowsArray((x) => [...x, { ...newRow }]);
                select_vals.push(transactionObj.type_txn);
                setIsEmpty(false);
              }
            }

            break;
          case 'Account':
            if (props.filter.searchInputValue == '') {
              if (
                transactionObj.accounts.length > 0 &&
                transactionObj.type_txn == props.filter.transactionType
              ) {
                newRow = {
                  index: _indexTrans,
                  date: _date_string,
                  id_token: _token_id,
                  type_txn: _transaction_type_formatted,
                };
                setRowsArray((x) => [...x, { ...newRow }]);
                select_vals.push(transactionObj.type_txn);
                setIsEmpty(false);
              }
            } else {
              found = transactionObj.accounts.indexOf(
                props.filter.searchInputValue.toString().trim(),
              );
              if (found != -1 && transactionObj.type_txn == props.filter.transactionType) {
                newRow = {
                  index: _indexTrans,
                  date: _date_string,
                  id_token: _token_id,
                  type_txn: _transaction_type_formatted,
                };
                setRowsArray((x) => [...x, { ...newRow }]);
                select_vals.push(transactionObj.type_txn);
                setIsEmpty(false);
              }
            }

            break;
        }
      }
      if (return_all_rows == true) {
        newRow = {
          index: _indexTrans,
          date: _date_string,
          id_token: _token_id,
          type_txn: _transaction_type_formatted,
        };
        setRowsArray((x) => [...x, { ...newRow }]);
        select_vals.push(transactionObj.type_txn);
        setIsEmpty(false);
      }
    }

    props.setTrans_types(removeDuplicates(select_vals));
    setAllTypes(removeDuplicates(array_with_all_types));
    props.setIsLoading(false);
  };
  useEffect(() => {
    if (props.searchBarTokenId != 'Not selected' && props.searchBarTokenId != '') {
      if (actor) {
        setRowsArray([]);
        setModalData({});
        props.setTransactionData([]);
        getHistory();
      }
    }
  }, [props.searchBarTokenId, props.filter]);

  return (
    <>
      {props.isLoading ? (
      <Container padding="16px">
        Loading...
      </Container>
      ) : (
        <TableContainer
          component={Paper}
          elevation={2}
        >
          <Table stickyHeader sx={{ minWidth: 650 }} aria-label="ogy_data_table">
            {props.searchBarTokenId == 'Not selected'? (
              <TableHead>
                <TableRow>
                  <TableCell sx={cell_style}>Select a Token ID</TableCell>
                </TableRow>
              </TableHead>
            ) : (
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    <IconButton
                      aria-label="Sort by..."
                      size="small"
                      sx={{ margin: 1 }}
                      onClick={changeOrder}
                    >
                      {isReverse ? <ArrowDownwardOutlinedIcon /> : <ArrowUpwardOutlinedIcon />}
                    </IconButton>
                    Transaction Index
                  </TableCell>
                  <TableCell align="center">Transaction Type</TableCell>
                  <TableCell align="center">Date</TableCell>
                </TableRow>
              </TableHead>
            )}

            {isEmpty ? (
              <TableBody>
                <TableRow
                  hover
                  key="Not found"
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    cursor: 'pointer',
                  }}
                >
                  <TableCell sx={cell_style}>Transactions not found</TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {rowsArray
                  .reverse()
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      hover
                      key={row.index}
                      onClick={(event) => openModal(event, row.index, props.transactionData)}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        cursor: 'pointer',
                      }}
                    >
                      <TableCell align="center">{row.index}</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                        {row.type_txn}
                      </TableCell>
                      <TableCell align="center">{row.date}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            )}
            <TableFooter />
          </Table>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={rowsArray.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}
      
      <Modal
        closeModal={handleClose}
        isOpened = {open}
        mode="light"
        size="md"   
      >
        <Container padding="16px">
          <Transaction modalData={modalData} />
          </Container>
      </Modal>
      </>
  );
};

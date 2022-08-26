import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import Collapse from '@mui/material/Collapse';
import FormControlLabel from '@mui/material/FormControlLabel';
import Autocomplete from '@mui/material/Autocomplete';
import { Filter } from '@dapp/utils'


// Select menu styling
const ITEM_HEIGHT: number = 48;
const ITEM_PADDING_TOP: number = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// Search into categories
const search_into = ['All', 'Principal', 'Account', 'Transaction Id'];

const removeDuplicates = (arr: string[]) => {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

export const TransactionFilter = (props : any) => {
  // Collapse - switch btn
  const [checked, setChecked] = React.useState(false);
  const handleChangeCollapse = () => {
    setChecked((prev) => !prev);
  };
  // AutocompleteVals
  const [AutocompleteVals, SetAutocompleteVals] = React.useState([]);
  // Update
  const [_update, setUpdate] = React.useState(1);
  // Fn for search on keyup event
  const [typedVal, setTypedVal] = React.useState('');

  const handleSelectIds = (event, value) => {
    myFilter.searchInputValue = '';
    if (value == null) {
      value = '';
    }
    setTypedVal(value);
    console.log(value);
    setUpdate(1);
  };

  // Fn for select category to filter
  const [searchTrough, setSearchTrough] = React.useState('All');
  const handleCategoryFilter = (event) => {
    myFilter.categoryToFilter = '';
    const {
      target: { value },
    } = event;
    setSearchTrough(value);
    setUpdate(1);
    let i: string;
    let k: string;
    const autocompleteArray: string[] = [];
    const objTransactions = props.transactionData;
    switch (value) {
      case 'Account': 
        for (i in objTransactions) {
          const accountArray: string[] = objTransactions[i].accounts;
          if (accountArray.length >= 1) {
            for (k in accountArray) {
              autocompleteArray.push(accountArray[k]);
            }
          }
        }
        setTypedVal('');
        break;
      case 'Principal':     
        for (i in objTransactions) {
          const principalArray: string[] = objTransactions[i].principals;
          if (principalArray.length >= 1) {
            for (k in principalArray) {
              autocompleteArray.push(principalArray[k]);
            }
          }
        }
        setTypedVal('');
        break;
      case 'Transaction Id':      
        for (i in objTransactions) {
          const id: string = objTransactions[i].trans_index;
          autocompleteArray.push(id);
        }
        setTypedVal('');
        break;
    }

    SetAutocompleteVals(removeDuplicates(autocompleteArray));
  };

  // Fn for select transaction types
  const [transType, setType] = React.useState('');
  const handleChangeSelect = (event) => {
    const {
      target: { value },
    } = event;
    setType(value);
    setUpdate(0);
  };

  const array_types: string[] = props.trans_types;

  // Filter for the ledger
  const myFilter: Filter = {
    searchInputValue: typedVal,
    categoryToFilter: searchTrough,
    transactionType: transType,
    update: _update,
  };

  useEffect(() => {
    props.setFilter(myFilter);
    props.setTrans_types(array_types);
  }, [typedVal, searchTrough, transType]);

  return (
    <Box
      component={Paper}
      elevation={2}
      sx={{ margin: 2, width: '100%', padding: 2 }}
    >
      {props.searchBarTokenId == 'Not selected' ? (
        <div>
          <FormControlLabel
            control={
              <Switch checked={checked} onChange={handleChangeCollapse} />
            }
            label="Filters unavailables, select a Token ID"
          />
        </div>
        ) : (
          <div>
            <FormControlLabel
              control={
                <Switch checked={checked} onChange={handleChangeCollapse} />
            }
              label="Filter transactions"
            />
            <Collapse in={checked}>
              <div>
                {props.isLoading ? (
                  <FormControl sx={{ m: 1, width: 400 }}>
                    <Autocomplete
                      disablePortal
                      disabled
                      id="combo-box-demo"
                      options={AutocompleteVals}
                      renderInput={(params) => (
                        <TextField {...params} label="Enter a value" />
                      )}
                      value={typedVal}
                      onChange={(event, newValue) => {
                        handleSelectIds(event, newValue);
                      }}
                    />
                  </FormControl>
                ) : (
                  <FormControl sx={{ m: 1, width: 400 }}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={AutocompleteVals}
                      renderInput={(params) => (
                        <TextField {...params} label="Enter a value" />
                      )}
                      value={typedVal}
                      onChange={(event, newValue) => {
                        handleSelectIds(event, newValue);
                      }}
                    />
                  </FormControl>
                )}
                {props.isLoading ? (
                  <FormControl sx={{ m: 1, width: 300 }}>
                    <InputLabel id="label-search-into-select">
                      Loading...
                    </InputLabel>
                    <Select
                      labelId="label-search-into-select"
                      id="search-into-select"
                      label="Loading..."
                      value="Loading..."
                      onChange={handleCategoryFilter}
                      MenuProps={MenuProps}
                      disabled
                      input={<OutlinedInput label="Loading..." />}
                    >
                      <MenuItem value="Loading..." key="0">
                        Loading...
                      </MenuItem>
                    </Select>
                  </FormControl>
                ) : (
                  <FormControl sx={{ m: 1, width: 300 }}>
                    <InputLabel id="label-search-into-select">Search</InputLabel>
                    <Select
                      labelId="label-search-into-select"
                      id="search-into-select"
                      label="Search"
                      value={searchTrough}
                      onChange={handleCategoryFilter}
                      MenuProps={MenuProps}
                      input={<OutlinedInput label="Search" />}
                    >
                      {search_into.map((filter_to_choose) => (
                        <MenuItem key={filter_to_choose} value={filter_to_choose}>
                        {filter_to_choose}
                      </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                {props.isLoading ? (
                  <FormControl sx={{ m: 1, width: 300 }}>
                    <InputLabel id="label-transaction-types-select">
                      Loading...
                    </InputLabel>
                    <Select
                      labelId="label-transaction-types-select"
                      id="transaction-select"
                      label="Loading..."
                      value="Loading..."
                      input={<OutlinedInput label="Loading..." />}
                      MenuProps={MenuProps}
                      disabled
                    >
                      <MenuItem key="0" value="Loading...">
                        Loading...
                      </MenuItem>
                    </Select>
                  </FormControl>
                ) : (
                  <FormControl sx={{ m: 1, width: 300 }}>
                    <InputLabel id="label-transaction-types-select">
                      Transaction type
                    </InputLabel>
                    <Select
                      labelId="label-transaction-types-select"
                      id="transaction-select"
                      label="Transaction type"
                      value={transType}
                      onChange={handleChangeSelect}
                      input={<OutlinedInput label="Transaction type" />}
                      MenuProps={MenuProps}
                    >
                      {array_types.map((typeOf) => (
                        <MenuItem key={typeOf} value={typeOf}>
                        {typeOf}
                      </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </div>
            </Collapse>
          </div>
        )}
    </Box>
  );
};

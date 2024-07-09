import React, { useEffect } from 'react';
import type { Filter } from '@dapp/utils';
import { Container, Select, Grid, Icons, Flex, Button } from '@origyn/origyn-art-ui';

// Search into categories
const search_into = ['All', 'Principal', 'Account', 'Transaction Id'];

const removeDuplicates = (arr: string[]) => {
  return arr.filter((item, index) => arr.indexOf(item) === index);
};

export const TransactionFilter = (props: any) => {
  // AutocompleteVals
  const [AutocompleteVals, SetAutocompleteVals] = React.useState(['-']);
  // Update
  const [_update, setUpdate] = React.useState(1);
  // Fn for search on keyup event
  const [typedVal, setTypedVal] = React.useState('-');

  const handleSelectIds = (value) => {
    myFilter.searchInputValue = '';
    if (value == null) {
      value = '';
    }
    setTypedVal(value);
    setUpdate(1);
  };

  // Fn for select category to filter
  const [searchTrough, setSearchTrough] = React.useState('All');

  const handleCategoryFilter = (value) => {
    myFilter.categoryToFilter = '';
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
  const [transType, setType] = React.useState('All types');
  const handleChangeSelect = (value) => {
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
    <Container padding="16px">
      {props.searchBarTokenId == 'Not selected' ? (
        <Container>Filters unavailable, select a Token.</Container>
      ) : (
        <>
          <Grid columns={2}>
            <Grid column={1}>
              <Flex flexFlow="row" align="center" fullWidth>
                <Button iconButton>
                  <Icons.FilterIcon width={18} height={18} />
                </Button>
                {props.isLoading ? (
                  <Container padding="16px">
                    <Select
                      options={[
                        {
                          value: 'Loading...',
                          label: 'Loading...',
                        },
                      ]}
                      placeholder="Loading..."
                    />
                  </Container>
                ) : (
                  <Container padding="16px">
                    <Select
                      options={search_into.map((val) => {
                        return {
                          value: val,
                          label: val,
                        };
                      })}
                      placeholder="Search"
                      selectedOption={{ value: searchTrough, label: searchTrough }}
                      handleChange={(opt) => {
                        handleCategoryFilter(opt.value);
                      }}
                    />
                  </Container>
                )}

                {props.isLoading ? (
                  <Container padding="16px">
                    <Select
                      options={AutocompleteVals.map((val) => {
                        return {
                          value: val,
                          label: val,
                        };
                      })}
                      placeholder="Enter Value"
                      selectedOption={{ value: typedVal, label: typedVal }}
                      handleChange={(opt) => {
                        handleSelectIds(opt.value);
                      }}
                    />
                  </Container>
                ) : (
                  <Container padding="16px">
                    <Select
                      options={AutocompleteVals.map((val) => {
                        return {
                          value: val,
                          label: val,
                        };
                      })}
                      placeholder="Enter Value"
                      selectedOption={{ value: typedVal, label: typedVal }}
                      handleChange={(opt) => {
                        handleSelectIds(opt.value);
                      }}
                    />
                  </Container>
                )}

                {props.isLoading ? (
                  <>
                    <Container padding="16px">
                      <Select
                        options={[
                          {
                            value: 'Loading...',
                            label: 'Loading...',
                          },
                        ]}
                        placeholder="Loading..."
                      />
                    </Container>
                  </>
                ) : (
                  <>
                    <Container padding="16px">
                      <Select
                        options={array_types.map((val) => {
                          return {
                            value: val,
                            label: val,
                          };
                        })}
                        placeholder="Search transactions types"
                        selectedOption={{ value: transType, label: transType }}
                        handleChange={(opt) => {
                          handleChangeSelect(opt.value);
                        }}
                      />
                    </Container>
                  </>
                )}
              </Flex>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
};

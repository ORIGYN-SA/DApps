import React, { useState } from 'react';
import { Button, Flex, Select, Icons, TextInput, Modal, Container } from '@origyn/origyn-art-ui';
import styled from 'styled-components';

const StyledFilter = styled.div`
  .mobileFilters {
    display: none;
  }
  .desktopFilters {
    display: block;
  }

  ${({ theme }) => theme.media.sm} {
    .mobileFilters {
      display: block;
    }
    .desktopFilters {
      display: none;
    }
  }
`;

type Option = {
  label: string;
  value: string;
};

type FilterPropTypes = {
  onChangeFilter: (value: string) => void;
  onChangeSort: (value: string) => void;
  onInput: (value: string) => void;
  initialFilterValue?: string;
  initialSortValue?: string;
};

const Filter = ({
  onChangeFilter,
  onChangeSort,
  onInput,
  initialFilterValue = '',
  initialSortValue = '',
}: FilterPropTypes) => {
  const filterOptions: Option[] = [
    { label: 'All', value: 'all' },
    { label: 'On Sale', value: 'onSale' },
    { label: 'Not On Sale', value: 'notOnSale' },
  ];

  const sortOptions: Option[] = [
    { label: 'Sale Price ASC', value: 'saleASC' },
    { label: 'Sale Price DESC', value: 'saleDESC' },
  ];

  const initialFilter =
    filterOptions.find((opt) => opt.value === initialFilterValue) || filterOptions[0];
  const initialSort = sortOptions.find((opt) => opt.value == initialSortValue) || sortOptions[0];

  const [mobileFilters, setMobileFilters] = useState(false);
  const [filter, setFilter] = useState(initialFilter);
  const [sort, setSort] = useState(initialSort);

  return (
    <StyledFilter>
      <div className="desktopFilters">
        <Flex fullWidth smFlexFlow="row" mdFlexFlow="row" gap={8}>
          <div style={{ minWidth: '30%' }}>
            <TextInput
              name="search"
              placeholder="Search"
              inputSize="small"
              onChange={(e) => onInput(e.target.value.toLowerCase())}
            />
          </div>
            {/* <Button iconButton size="small">
              <Icons.FilterIcon />
            </Button> */}
            <div style={{ minWidth: '20%' }}>
              <Select
                inputSize="small"
                placeholder="Filter"
                selectedOption={filter}
                handleChange={(opt: Option) => {
                  onChangeFilter(opt.value);
                  setFilter(opt);
                }}
                options={filterOptions}
              />
            </div>

            {/* <TextInput
              name="search"
              placeholder="Search"
              inputSize="small"
              onChange={(e) => onInput(e.target.value.toLowerCase())}
            /> */}

            {/* <div style={{ minWidth: 170 }}>
              <Select
                inputSize="small"
                placeholder="Sort"
                selectedOption={sort}
                handleChange={(opt) => {
                  onChangeSort(opt.value);
                  setSort(opt);
                }}
                options={sortOptions}
              />
            </div> */}
        </Flex>
      </div>
      <div className="mobileFilters">
        <Flex justify="space-between" fullWidth gap={8}>
          <Flex align="center" gap={12}>
            <Button iconButton size="small">
              <Icons.FilterIcon onClick={() => setMobileFilters(true)} />
            </Button>
          </Flex>
          <Flex align="center" gap={12}>
            <TextInput name="search" placeholder="Search" inputSize="small" />
            <Button btnType="outlined" iconButton size="small">
              <Icons.TransactionIcon height={10} width={32} />
            </Button>
          </Flex>
        </Flex>
      </div>
      <Modal isOpened={mobileFilters} closeModal={() => setMobileFilters(false)}>
        <Container padding="50px 24px">
          <h2>Filters</h2>
          <Button
            onClick={() => {
              onChangeFilter('onSale');
              setMobileFilters(false);
            }}
          >
            On Sale
          </Button>
          <Select
            inputSize="small"
            placeholder="Sort"
            selectedOption={sort}
            handleChange={(opt) => {
              onChangeSort(opt.value);
              setSort(opt);
            }}
            options={[
              { label: 'Sale Price ASC', value: 'saleASC' },
              { label: 'Sale Price DESC', value: 'saleDESC' },
            ]}
          />
        </Container>
      </Modal>
    </StyledFilter>
  );
};

export default Filter;

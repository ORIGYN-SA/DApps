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

const SearchIcon = () => {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15.9 17.3L10.3 11.7C9.8 12.1 9.225 12.4167 8.575 12.65C7.925 12.8833 7.23333 13 6.5 13C4.68333 13 3.146 12.371 1.888 11.113C0.629333 9.85433 0 8.31667 0 6.5C0 4.68333 0.629333 3.14567 1.888 1.887C3.146 0.629 4.68333 0 6.5 0C8.31667 0 9.85433 0.629 11.113 1.887C12.371 3.14567 13 4.68333 13 6.5C13 7.23333 12.8833 7.925 12.65 8.575C12.4167 9.225 12.1 9.8 11.7 10.3L17.325 15.925C17.5083 16.1083 17.6 16.3333 17.6 16.6C17.6 16.8667 17.5 17.1 17.3 17.3C17.1167 17.4833 16.8833 17.575 16.6 17.575C16.3167 17.575 16.0833 17.4833 15.9 17.3ZM6.5 11C7.75 11 8.81267 10.5627 9.688 9.688C10.5627 8.81267 11 7.75 11 6.5C11 5.25 10.5627 4.18733 9.688 3.312C8.81267 2.43733 7.75 2 6.5 2C5.25 2 4.18733 2.43733 3.312 3.312C2.43733 4.18733 2 5.25 2 6.5C2 7.75 2.43733 8.81267 3.312 9.688C4.18733 10.5627 5.25 11 6.5 11Z"
        fill="#151515"
      />
    </svg>
  );
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
              /*@ts-ignore*/
              placeholder="Search"
              inputSize="small"
              style={{
                backgroundImage: `url(${SearchIcon})`, // set the SVG icon as background image
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'left center',
                paddingLeft: '20px', // add left padding to make room for the icon
              }}
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

          <div style={{ minWidth: '20%' }}>
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

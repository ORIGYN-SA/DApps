import React, { useState } from 'react'
import { Button, Flex, Select, Icons, SearchInput, TextInput, Modal, Container } from '@origyn-sa/origyn-art-ui'
import styled from 'styled-components'

const StyledFilter = styled.div`
  .mobileFilters {
    display: none;
  }
  .desktopFilters {
    display: block;
  }
  
  ${({theme}) => theme.media.sm} {
    .mobileFilters {
      display: block;
    }
    .desktopFilters {
      display: none;
    }
  }
`

const Filter = ({onChangeFilter, onChangeSort, onInput}) => {
  const [mobileFilters, setMobileFilters] = useState(false);
  const [filter, setFilter] = useState();
  const [sort, setSort] = useState();

  return (
    <StyledFilter>
      <div className="desktopFilters">
        <Flex justify='space-between' fullWidth smFlexFlow="column" mdFlexFlow="column" gap={8}>
          <Flex align='center' gap={12} smFlexFlow="column">
            <Button iconButton size='small'>
              <Icons.FilterIcon />
            </Button>
            <div style={{minWidth: 170}}>
              <Select
                inputSize="small"
                placeholder="Filter"
                selectedOption={filter}
                handleChange={(opt) => {
                  onChangeFilter(opt.value);
                  setFilter(opt)
                }}
                options={[
                  {label: 'On Sale', value: 'onSale'},
                  {label: 'Not On Sale', value: 'notOnSale'},
                ]}
              />
            </div>
          </Flex>
          <Flex align='center' gap={12} smFlexFlow="column">
              <TextInput
              name="search"
              placeholder="Search"
              inputSize="small"
              onChange={(e)=>onInput(e.target.value.toLowerCase())}
            />
           
            <div style={{minWidth: 170}}>
              <Select
                inputSize="small"
                placeholder="Sort"
                selectedOption={sort}
                handleChange={(opt) => {
                  onChangeSort(opt.value);
                  setSort(opt)
                }}
                options={[
                  {label: 'Sale Price ASC', value: 'saleASC'},
                  {label: 'Sale Price DESC', value: 'saleDESC'},
                ]}
              />
            </div>
          </Flex>
        </Flex>
      </div>
      <div className="mobileFilters">
        <Flex justify='space-between' fullWidth gap={8}>
          <Flex align='center' gap={12}>
            <Button iconButton size='small'>
              <Icons.FilterIcon onClick={() => setMobileFilters(true)} />
            </Button>
          </Flex>
          <Flex align='center' gap={12}>
            <TextInput
              name="search"
              placeholder="Search"
              inputSize="small"
            />
            <Button btnType='outlined' iconButton size='small'>
              <Icons.TransactionIcon height={10} width={32} />
            </Button>
          </Flex>
        </Flex>
      </div>
      <Modal
        isOpened={mobileFilters}
        closeModal={() => setMobileFilters(false)}
      >
        <Container padding="50px 24px">
          <h2>Filters</h2>
          <Button onClick={() => {
            onChangeFilter("onSale");
            setMobileFilters(false);
          }}>
            On Sale
          </Button>
          <Select
            inputSize="small"
            placeholder="Sort"
            selectedOption={sort}
            handleChange={(opt) => {
              onChangeSort(opt.value);
              setSort(opt)
            }}
            options={[
              {label: 'Sale Price ASC', value: 'saleASC'},
              {label: 'Sale Price DESC', value: 'saleDESC'},
            ]}
          />
        </Container>
      </Modal>
    </StyledFilter>
  )
}

export default Filter;
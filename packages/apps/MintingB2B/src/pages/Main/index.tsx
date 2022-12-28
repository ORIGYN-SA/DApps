import { Box, Tooltip, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import {
  LoadingContainer,
} from '@dapp/features-components'
import {
  Button,
  Card,
  Flex,
  Grid,
  HR,
  Icons,
  SecondaryNav,
  Select,
  TabContent,
  TextInput,
  Container,
  Pagination, DatePicker,
} from '@origyn-sa/origyn-art-ui'
import styled from 'styled-components'
import { Link } from 'react-router-dom'


const GuestContainer = ({ onLogin }) => {
  const [token, setToken] = useState('')

  return (
    <Box
      component='main'
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexGrow: 1,
        minHeight: '100%',
      }}
    >
      <Container size='sm' align='center'>
        <TextInput
          label='Login'
        />
        <TextInput
          label='Password'
          type='password'
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <br />
        <Flex fullWidth justify='center'>
          <Button
            variant='contained'
            onClick={() => onLogin(token)}
          >
            Connect wallet
          </Button>
        </Flex>
      </Container>
    </Box>
  )
}

const RenderBlock = (obj) => {
  switch (obj.type) {
    case "object":
      return <div>
        <br/>
        <h4>{obj?.label}</h4>
        <br/>
        {Object.keys(obj?.properties)?.map((key) => {
          return <RenderBlock {...obj?.properties[key]} />
        })}
      </div>
    case "text":
    case "number":
      return <TextInput type={obj.type} label={obj.label} />
    case "date":
      return <DatePicker label={obj.label} selected={new Date()} onChange={() => {}} />
    default:
      return <div></div>
  }
}

const dataStructures = {
  IGI: {
    report: {
      type: "object",
      label: "Report",
      properties: {
        name: {
          type: "text",
          label: "Name",
          required: false,
        },
        report_date: {
          type: "date",
          label: "Report Date",
          required: false,
        },
        report_number: {
          type: "number",
          label: "Report Number",
          required: false,
        },
        grading: {
          type: "object",
          label: "Grading Results",
          properties: {
            carat_weight: {
              type: "number",
              label: "Carat Weight",
              required: false,
            },
            shape: {
              type: "number",
              label: "Shape & Cut Description",
              required: false,
            },
          },
        }
      }
    }
  },
  Luxury: {}
};

const WalletPage = () => {
  const [loggedIn, setLoggedIn] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [nftList, setNftList] = useState([])
  const [pagination, setPagination] = useState<any>()
  const [currentPage, setCurrentPage] = useState<any>(1)
  const handleLogOut = () => {
    setLoggedIn('')
    localStorage.removeItem('apiKey')
    setNftList([])
  }

  const fetchData = async (page: number) => {
    const response = await fetch(
      `https://development.origyn.network/canister/v0/nft-token?sortKey=createdAt&sortDirection=-1&skip=${30 * (page - 1)}`,
      {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'x-api-key': loggedIn,
        },
      })
    const data = await response.json()
    console.log(data)
    setNftList(data.data)
    setPagination(data.cursor)
    setIsLoading(false)
    return data
  }

  useEffect(() => {
    if (loggedIn) {
      console.log(loggedIn)
      localStorage.setItem('apiKey', loggedIn)
      fetchData(1)
    }
  }, [loggedIn])

  useEffect(() => {
    if (loggedIn) {
      fetchData(currentPage)
    }
  }, [currentPage])

  useEffect(() => {
    console.log(localStorage.getItem('apiKey'))
    setLoggedIn(localStorage.getItem('apiKey'))
  }, [])

  return (
    <>
      {loggedIn ? (
        <Flex fullWidth padding='0' flexFlow='column'>
          <SecondaryNav
            title='Vault'
            tabs={[
              { title: 'NFTs', id: 'NFTs' },
              { title: 'Minter', id: 'Minter' },
            ]}
            content={[
              <Container padding='16px'>
                <br/>
                <h2>NFTs</h2>
                <br/>
                {
                  isLoading ? (
                    <LoadingContainer />
                  ) : (
                    <Flex flexFlow='column' gap={8}>
                      <Pagination
                        pageCount={Math.ceil(pagination?.total / pagination?.limit)}
                        onPageChange={setCurrentPage}
                      />
                      {
                        nftList.map((item) => {
                          return (
                            <Card as={Link} to={`/${item.tokenId}`} padding='8px' justify='space-between'>
                              <Flex flexFlow='column' gap={4}>
                                <p className='secondary_color'>Token ID</p>
                                <p>{item.tokenId}</p>
                              </Flex>
                              <Flex flexFlow='column' gap={4}>
                                <p className='secondary_color'>App Type</p>
                                <p>{item.appType}</p>
                              </Flex>
                              <Flex flexFlow='column' gap={4}>
                                <p className='secondary_color'>Status</p>
                                <p>{item.status}</p>
                              </Flex>
                            </Card>
                          )
                        })
                      }
                    </Flex>
                  )
                }
              </Container>,
              <Container padding='16px'>
                <br/>
                <h2>Minter</h2>
                <br/>
                <RenderBlock
                  {...dataStructures.IGI.report}
                />
              </Container>,
            ]}
            onLogOut={handleLogOut}
            principal={loggedIn}
          />
        </Flex>
      ) : (
        <GuestContainer
          onLogin={setLoggedIn}
        />
      )}
    </>
  )
}

export default WalletPage

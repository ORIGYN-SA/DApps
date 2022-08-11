import React from 'react'
import styled from 'styled-components'
import Logo from '../components/Logo'
import Grid from '@mui/material/Grid'
import PropTypes from 'prop-types';

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #151515;
  // box-shadow: 1px 1px 5px 0px #85888c;
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 99;
  max-height: 80px;
  height: 80px;
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  color: #ffffff !important;
  @media (max-width: 767px) {
    display: block;
  }
`

const HeaderPart = ({ children }) => {
  return (
    <div>
      <Header>
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid item xs={6} sx={{}}>
            <Logo />
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              textAlign: 'right',
              letterSpacing: '1px',
            }}
          >
            <p>
              {' '}
              Library dApp <b>V 0.1.0</b>{' '}
            </p>
          </Grid>
        </Grid>
      </Header>
      <div>{children}</div>
    </div>
  )
}

HeaderPart.propTypes = {
  children: PropTypes.node.isRequired,
  };

export default HeaderPart

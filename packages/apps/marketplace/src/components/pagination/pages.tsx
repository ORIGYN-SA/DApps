import React, { useState, useEffect } from 'react';
import {
  Card,
  Container,
  Flex,
  Button,
  HR,
  Grid,
  Image,
  SecondaryNav,
  ShowMoreBlock,
  theme,
} from '@origyn/origyn-art-ui';
import { useMarketplace } from '../../components/context';
import { OdcDataWithSale, parseOdcs, parseMetadata, toLargerUnit, getRootUrl } from '@dapp/utils';
import { Link } from 'react-router-dom';
import { PlaceholderIcon } from '@dapp/common-assets';
import { LoadingContainer, TokenIcon } from '@dapp/features-components';
import { AuthContext, useRoute } from '@dapp/features-authentication';

const Pagination = ({ total, current, onClick }) => {

    const pages = Array.from({ length: total }, (_, i) => i + 1);

    return (
      <div>
        {pages.map((page) => (
          <Button key={page} onClick={() => onClick(page)} disabled={current === page}>
            {page}
          </Button>
        ))}
      </div>
    );
  }

  export default Pagination
  
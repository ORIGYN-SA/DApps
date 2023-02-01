import React, { useEffect } from 'react';
import { Pagination, Container, Flex, Grid, HR, ProductCard } from '@origyn-sa/origyn-art-ui';
import { CertificateList as Props } from '../smart-components/CertificateListContainer';

const CertificateCard = ({ certificate }) => {
  const isClaimed = certificate.status === 'SUCCESS';

  return (
    <ProductCard
      image={certificate.image}
      title={certificate?.dataFields?.name}
      info={`IGI Report #${certificate?.dataFields?.report_number}`}
      status={
        <span style={{ fontWeight: 700, color: isClaimed ? '#5eac31' : '#dd1422' }}>
          {isClaimed ? 'Claimed' : 'Unclaimed'}
        </span>
      }
    />
  );
};

const CertificateList = ({ certificates, currentPage, onPageChange, pagination }: Props) => {
  return (
    <>
      <Container padding="16px">
        <h2>Library</h2>
      </Container>
      <HR />
      <Container padding="16px">
        <Flex flexWrap="wrap" flexFlow="row" gap={8}>
          {certificates.map((certificate) => (
            <CertificateCard key={certificate._id} certificate={certificate} />
          ))}
        </Flex>
      </Container>
      <Grid columns={3}>
        <div />
        <Pagination
          pageCount={Math.ceil(pagination?.total / pagination?.limit)}
          onPageChange={onPageChange}
        />
        <div />
      </Grid>
    </>
  );
};

export default CertificateList;

import React from 'react';
import styled from 'styled-components';
import { Pagination, Grid, HR, ProductCard } from '@origyn-sa/origyn-art-ui';
import { CertificateList as Props } from '../smart-components/CertificateListContainer';

const StyledListContainer = styled('div')`
  display: flex;
  flex-wrap: wrap;
  padding-top: 24px;
  gap: 10px;
`;
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
      <h5 style={{ marginBottom: '24px' }}>Library</h5>
      <HR />
      <StyledListContainer>
        {certificates.map((certificate) => (
          <CertificateCard key={certificate._id} certificate={certificate} />
        ))}
      </StyledListContainer>
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

import React, { useState, useEffect } from 'react';
import { CandyToJson } from '../../../../../utils/src/candyParser';
import { getCertificateMetadata, getCertificates } from '../../services/nft-token';

const CertificateListContainer = ({ render, renderLoading }: ContainerProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [certificates, setCertificates] = useState<Array<unknown>>([]);
  const [pagination, setPagination] = useState<Pagination | undefined>();
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchCertificates = async (page: number, force = false) => {
    if (isLoading && !force) return;

    setCurrentPage(page);
    setIsLoading(true);

    // TODO: I really do not like this, the be should aggregate this
    const _certificates = await getCertificates(page);
    _certificates.data = await Promise.all(
      _certificates.data.map(async (certificate) => {
        const metadata = await getCertificateMetadata(certificate._id);
        if (!metadata.metadata) return certificate;
        const image = metadata?.metadata?.library?.[0]?.library_file;
        const dataFields = new CandyToJson(metadata).getAllDataFields();
        return {
          ...certificate,
          image,
          dataFields,
        };
      }),
    );
    console.log(
      '🚀 ~ file: CertificateListContainer.tsx:35 ~ fetchCertificates ~ _certificates.data',
      _certificates.data,
    );
    setCertificates(_certificates.data);
    setPagination(_certificates.cursor);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCertificates(currentPage, true);
  }, []);

  useEffect(() => {
    fetchCertificates(currentPage);
  }, [currentPage]);

  if (isLoading || !certificates) return renderLoading();

  return render({ certificates, pagination, onPageChange: setCurrentPage, currentPage });
};

export default CertificateListContainer;

type ContainerProps = {
  render: (args: CertificateList) => JSX.Element;
  renderLoading: () => JSX.Element;
};

export type CertificateList = {
  certificates: Array<unknown>;
  currentPage: number;
  onPageChange: (page: number) => void;
  pagination: Pagination;
};

type Pagination = {
  limit: number;
  skip: number;
  total: number;
};

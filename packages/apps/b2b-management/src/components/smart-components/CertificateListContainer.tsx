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

    // TODO: I really do not like this, we should have an aggregation that does it
    const _certificates = await getCertificates(page);
    _certificates.data = await Promise.all(
      _certificates.data.map(async (certificate) => {
        const metadata = await getCertificateMetadata(certificate._id);
        if (!metadata.metadata) return certificate;
        const image = metadata?.metadata?.library?.[0]?.library_file;
        let dataFields;
        try {
          dataFields = new CandyToJson(metadata).getAllDataFields();
        } catch (e) {
          return {
            ...certificate,
            image,
          };
        }
        return {
          ...certificate,
          image,
          dataFields,
        };
      }),
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

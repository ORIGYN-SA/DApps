import React from 'react';
import { Button, Flex } from '@origyn/origyn-art-ui';

interface PaginationProps {
  total: number;
  current: number;
  onClick: (pageNumber: number) => void;
}

const Pagination = ({ total, current, onClick }: PaginationProps) => {
  const pages = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div>
      <Flex flexFlow="row">
        {pages.map((page) => (
          <Button key={page} onClick={() => onClick(page)} disabled={current === page}>
            {page}
          </Button>
        ))}
      </Flex>
    </div>
  );
};

export default Pagination;

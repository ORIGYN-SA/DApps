import React from 'react';
import {
  Button,
  Flex
} from '@origyn/origyn-art-ui';

const Pagination = ({ total, current, onClick }) => {

    const pages = Array.from({ length: total }, (_, i) => i + 1);

    return (
      <div>
        <Flex flexFlow='row'>
        {pages.map((page) => (
          
          <Button key={page} onClick={() => onClick(page)} disabled={current === page}>
            {page}
          </Button>
         
        ))}
         </Flex>
      </div>
    );
  }

  export default Pagination
  
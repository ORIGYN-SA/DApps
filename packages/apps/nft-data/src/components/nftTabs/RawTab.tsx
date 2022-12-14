import React from 'react';
import { JsonToTable } from 'react-json-to-table';

const RawTab = ({ metadata }: any) => {
  return (
    <div>
      <JsonToTable json={metadata} />
    </div>
  );
};

export default RawTab;

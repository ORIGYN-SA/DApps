import React from 'react';

const JSONTab = ({ metadata }: any) => {
  console.log(metadata);

  return (
    <div>
      <pre>{JSON.stringify(metadata, null, 2)}</pre>
    </div>
  );
};

export default JSONTab;

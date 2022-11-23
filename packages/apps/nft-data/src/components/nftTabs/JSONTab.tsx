import React from 'react';

const JSONTab = ({ metadata }: any) => {
  console.log(metadata);

  return (
    <div>
      <>{JSON.stringify(metadata, null, 2)}</>
    </div>
  );
};

export default JSONTab;

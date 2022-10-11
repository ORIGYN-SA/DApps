import React from 'react';

const JSONTab = ({ metadata }: any) => {

  return (
    <div>
      <pre data-testid="jsontable">{JSON.stringify(metadata, null, 2)}</pre>
    </div>
  );
};

export default JSONTab;

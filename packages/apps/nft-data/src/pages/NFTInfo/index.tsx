import * as React from 'react';
import TreeTab from '../../components/nftTabs/TreeTab';
import RawTab from '../../components/nftTabs/RawTab';
import FormTab from '../../components/nftTabs/FormTab';
import JSONTab from '../../components/nftTabs/JSONTab';
import { SecondaryNav } from '@origyn-sa/origyn-art-ui';

const NFTInfo = ({ metadata }: any) => {

  return (
    <>
      <SecondaryNav
        title="NFT Data"
        tabs={[
          { title: 'Form', id: 'Form' },
          { title: 'Tree', id: 'Tree' },
          { title: 'Raw', id: 'Raw' },
          { title: 'JSON', id: 'JSON' },
        ]}
        content={[
          <FormTab metadata={metadata} />,
          <TreeTab metadata={metadata} />,
          <RawTab metadata={metadata} />,
          <JSONTab metadata={metadata} />,
        ]}
      />
    </>
  );
};

export default NFTInfo;

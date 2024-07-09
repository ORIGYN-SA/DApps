import * as React from 'react';
import TreeTab from '../../components/nftTabs/TreeTab';
import RawTab from '../../components/nftTabs/RawTab';
import FormTab from '../../components/nftTabs/FormTab';
import JSONTab from '../../components/nftTabs/JSONTab';
import { SecondaryNav } from '@origyn/origyn-art-ui';
import { useContext } from 'react';
import { AuthContext } from '@dapp/features-authentication';
import { useDialog } from '@connect2ic/react';

const NFTInfo = ({ metadata }: any) => {
  const { principal, handleLogOut } = useContext(AuthContext);
  const { open } = useDialog();

  return (
    <>
      <SecondaryNav
        title="Certificates Data"
        tabs={[
          { title: 'Form', id: 'Form' },
          { title: 'Tree', id: 'Tree' },
          { title: 'Raw', id: 'Raw' },
          { title: 'JSON', id: 'JSON' },
        ]}
        content={[
          <FormTab metadata={metadata} key="formTab" />,
          <TreeTab metadata={metadata} key="treeTab" />,
          <RawTab metadata={metadata} key="rawTab" />,
          <JSONTab metadata={metadata} key="jsonTab" />,
        ]}
        onLogOut={handleLogOut}
        onConnect={open}
        principal={principal?.toText() === '2vxsx-fae' ? '' : principal?.toText()}
      />
    </>
  );
};

export default NFTInfo;

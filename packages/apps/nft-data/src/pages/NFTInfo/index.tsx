import * as React from 'react';
import TreeTab from '../../components/nftTabs/TreeTab';
import RawTab from '../../components/nftTabs/RawTab';
import FormTab from '../../components/nftTabs/FormTab';
import JSONTab from '../../components/nftTabs/JSONTab';
import { SecondaryNav } from '@origyn-sa/origyn-art-ui'
import { useContext } from 'react'
import { AuthContext } from '../../../../../features/authentication'
import { useDialog } from '@connect2ic/react'

const NFTInfo = ({ metadata }: any) => {
  const { principal, handleLogOut } = useContext(AuthContext)
  const { open } = useDialog()

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
          <FormTab metadata={metadata} />,
          <TreeTab metadata={metadata} />,
          <RawTab metadata={metadata} />,
          <JSONTab metadata={metadata} />,
        ]}
        onLogOut={handleLogOut}
        onConnect={open}
        principal={principal?.toText() === "2vxsx-fae" ? "" : principal?.toText()}
      />
    </>
  );
};

export default NFTInfo;

import React, { useContext } from 'react'
import Box from '@mui/material/Box';
import Container from '@mui/material/Container'
import ColumnView from '../../components/ColumnView';
import { SwitchCanisterCollection } from '@dapp/features-components';
import { SecondaryNav } from '@origyn-sa/origyn-art-ui'
import { AuthContext } from '../../../../../features/authentication'
import { useDialog } from '@connect2ic/react'

const Library = () => {
  const { principal, handleLogOut } = useContext(AuthContext)
  const { open } = useDialog()

  return (
    <div>
      {console.log(principal?.toText())}
      <SecondaryNav
        title='Vault'
        tabs={[
          { title: 'Balance', id: 'Balance' },
        ]}
        content={[
          <Box>
            <SwitchCanisterCollection />
            <ColumnView />
          </Box>
        ]}
        onLogOut={handleLogOut}
        onConnect={() => {open()}}
        principal={principal.toText() === "2vxsx-fae" ? "" : principal?.toText()} />
    </div>
  );
};

export default Library;

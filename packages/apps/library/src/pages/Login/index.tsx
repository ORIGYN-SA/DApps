import React, { useContext } from 'react'
import ColumnView from '../../components/ColumnView';
import { SecondaryNav, Container } from '@origyn-sa/origyn-art-ui'
import { AuthContext } from '../../../../../features/authentication'
import { useDialog } from '@connect2ic/react'

const Library = () => {
  const { principal, handleLogOut } = useContext(AuthContext)
  const { open } = useDialog()

  return (

    <Container>
      <SecondaryNav
        title='Vault'
        tabs={[
          { title: 'Balance', id: 'Balance' },
        ]}
        content={[
          <Container padding="16px">
            <ColumnView />
          </Container>
        ]}
        onLogOut={handleLogOut}
        onConnect={() => {open()}}
        principal={principal.toText() === "2vxsx-fae" ? "" : principal?.toText()} />
    </Container>
  );
};

export default Library;

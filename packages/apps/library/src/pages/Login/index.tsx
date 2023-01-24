import React, { useContext, useEffect } from 'react';
import ColumnView from '../../components/ColumnView';
import { SecondaryNav, Container } from '@origyn-sa/origyn-art-ui';
import { AuthContext } from '../../../../../features/authentication';
import { useDialog } from '@connect2ic/react';

const Library = () => {
  const { principal, handleLogOut } = useContext(AuthContext);
  const { open } = useDialog();

  useEffect(() => {
    document.title = 'Origyn Library Browser';
  }, []);

  return (
    <Container>
      <SecondaryNav
        title="Library"
        tabs={[{ title: 'Explore', id: 'Explore' }]}
        content={[
          <Container padding="16px">
            <ColumnView />
          </Container>,
        ]}
        onLogOut={handleLogOut}
        onConnect={() => {
          open();
        }}
        principal={principal.toText() === '2vxsx-fae' ? '' : principal?.toText()}
      />
    </Container>
  );
};

export default Library;

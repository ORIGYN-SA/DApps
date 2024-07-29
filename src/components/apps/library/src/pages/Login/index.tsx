import React, { useContext, useEffect } from 'react';
import ColumnView from '../../components/ColumnView';
import { SecondaryNav, Container } from '@origyn/origyn-art-ui';
import { AuthContext } from '@dapp/features-authentication';
import { useDialog } from '@connect2ic/react';
import { PerpetualOSContext } from '@dapp/features-context-provider';

const Library = () => {
  const context = useContext(PerpetualOSContext);
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
        titleLink={`${context.canisterUrl}/collection/-/library`}
        content={[
          <Container padding="16px" key="secondaryNavContent">
            <ColumnView />
          </Container>,
        ]}
        onLogOut={handleLogOut}
        onConnect={open}
        principal={principal?.toText() === '2vxsx-fae' ? '' : principal?.toText()}
      />
    </Container>
  );
};

export default Library;

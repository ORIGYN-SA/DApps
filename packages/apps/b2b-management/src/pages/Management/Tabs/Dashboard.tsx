import React from 'react';
import CertificateList from '../../../components/lists/CertificateList';
import CertificateListContainer from '../../../components/smart-components/CertificateListContainer';

const Dashboard = () => {
  return (
    <CertificateListContainer
      key="1"
      render={(args) => <CertificateList {...args} />}
      renderLoading={() => <div>Loading...</div>}
    />
  );
};

export default Dashboard;

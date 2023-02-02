import React from 'react';
import styled from 'styled-components';
import { Container } from '@origyn-sa/origyn-art-ui';
import CertificateList from '../../../components/lists/CertificateList';
import StatisticsPane from '../../../components/StatisticsPane';
import CertificateListContainer from '../../../components/smart-components/CertificateListContainer';
import StatisticsPaneContainer from '../../../components/smart-components/StatisticsPaneContainer';
import ActivityFeedContainer from '../../../components/smart-components/ActivityFeedContainer';
import ActivityFeedList from '../../../components/lists/ActivityFeedList';

const StyledTitleContainer = styled('div')`
  & > h2 {
    margin: 48px 24px 48px 24px;
  }
  border-bottom: 1px solid #e3e3e3;
`;

const StyledContainer = styled('div')`
  padding: 0 24px;
`;

const StyledHistoryAndLibraryContainer = styled('div')`
  margin-top: 24px;
  display: flex;
  flex-wrap: nowrap;
  gap: 20px;
`;

const Dashboard = () => {
  return (
    <>
      <StyledTitleContainer>
        <h2>Certificate Management Dashboard</h2>
      </StyledTitleContainer>
      <StyledContainer>
        <StatisticsPaneContainer
          render={(args) => <StatisticsPane {...args} />}
          renderLoading={() => <div>Loading...</div>}
        />
        <StyledHistoryAndLibraryContainer>
          <div style={{ width: '350px' }}>
            <ActivityFeedContainer
              render={(args) => <ActivityFeedList {...args} />}
              renderLoading={() => <div>Loading...</div>}
            />
          </div>
          <div>
            <CertificateListContainer
              render={(args) => <CertificateList {...args} />}
              renderLoading={() => <div>Loading...</div>}
            />
          </div>
        </StyledHistoryAndLibraryContainer>
      </StyledContainer>
    </>
  );
};

export default Dashboard;

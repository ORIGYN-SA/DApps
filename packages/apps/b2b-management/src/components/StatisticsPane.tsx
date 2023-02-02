import styled from 'styled-components';
import { Container, Flex, Grid, HR, Graph } from '@origyn-sa/origyn-art-ui';
import React from 'react';
import { StatisticsPane as Props } from './smart-components/StatisticsPaneContainer';
import { formatNumber } from '@dapp/utils';
import DonutChart from './DonutChart';

const StyledStatistic = styled('div')`
  display: block;

  & > span {
    font-size: 12px;
    font-weight: 600;
  }
  & > h4 {
    font-size: 32px;
    font-weight: 500;
    letter-spacing: -1px;
    line-height: 1.25;
    margin-top: 8px;
  }
`;

const StyledPanelTitle = styled('h4')`
  margin: 24px 0;
`;
const StyledGridContainer = styled('div')`
  display: flex;
  flex-wrap: nowrap;
`;

const StyledStatsContainer = styled('div')`
  ${({ theme }) => `
      background-color: ${theme.colors.NAVIGATION_BACKGROUND};
  `}
  border-radius: 12px;
  border: 1px solid #e3e3e3;
`;
const Statistic = ({ title, value }: Statistic) => {
  if (!value) value = 0;

  const valueAsString = typeof value === 'string' ? value : formatNumber(value);
  return (
    <StyledStatistic>
      <span>{title}</span>
      <h4>{valueAsString}</h4>
    </StyledStatistic>
  );
};

const onGraphFrameChange = (days: number) => {
  // TODO: We will do getStatistics(days) here
};

const StatisticsPane = ({ statistics }: Props) => {
  const { totalClaimedCount, totalUnClaimedCount } = statistics;
  const claimedPercentage = (totalClaimedCount * 100) / (totalClaimedCount + totalUnClaimedCount);
  const graphData: Record<string, number> = statistics.dailyCounts.reduce((prev, value) => {
    const unix = new Date(value._id).getTime() / 1000;
    prev[unix] = value.transactionsCount;
    return prev;
  }, {});

  return (
    <>
      <StyledPanelTitle>Certificate Stats</StyledPanelTitle>
      <StyledStatsContainer>
        <StyledGridContainer>
          <div style={{ width: '100%' }}>
            <Container padding="24px" style={{ height: '220px' }}>
              <h6>Total Certificate Status</h6>
              <Flex flexWrap="nowrap" gap={24} style={{ marginTop: '16px' }}>
                <Statistic title="Unique Certificate Owners" value="5" />
                <Statistic title="Total Claimed" value={statistics.totalClaimedCount} />
                <Statistic title="Total Unclaimed" value={statistics.totalUnClaimedCount} />
                <Statistic title="Avg Daily Tx" value={statistics.averageTransactions ?? 0} />
              </Flex>
            </Container>
            <HR />
            <Container padding="24px">
              <h6>Certificate Claim Status</h6>
              <Flex flexWrap="nowrap" gap={24} style={{ marginTop: '16px' }}>
                <DonutChart percentage={claimedPercentage} />
              </Flex>
            </Container>
          </div>

          {/* Columns Separator */}

          <div style={{ borderLeft: '1px solid #e3e3e3', width: '750px' }}>
            <Graph
              onFrameChange={onGraphFrameChange}
              token="Daily Certificate Transactions"
              frame={2}
              hidePriceChange={true}
              data={graphData}
              width="750px"
              tooltipLabel={{ text: 'Certs Claimed', unit: '' }}
            />
          </div>
        </StyledGridContainer>
      </StyledStatsContainer>
    </>
  );
};

type Statistic = {
  title: string;
  value: string | number;
};
export default StatisticsPane;

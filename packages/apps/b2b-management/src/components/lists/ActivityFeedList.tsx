import styled from 'styled-components';
import React from 'react';
import { ActivityFeedList as Props } from '../smart-components/ActivityFeedContainer';

const StyledActivityList = styled('div')`
  background-color: #fefefe;
  padding: 24px 24px 32px;
  border-radius: 12px;
  border: solid 1px #f2f2f2;
`;

const StyledActivityItem = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 16px;
  margin: 24px 0;
  padding: 16px;
  border-radius: 12px;
  border: solid 1px #f2f2f2;
  background-color: #fafafa;

  &:first-child {
    margin: 0;
  }

  & span {
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.57;
    letter-spacing: -0.15px;
    text-align: left;
    color: #6f6f6f;
  }

  & p {
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.57;
    letter-spacing: -0.15px;
    text-align: left;
    color: #000;
  }
`;

const StyledChip = styled('div')`
  padding: 4px;
  border-radius: 8px;
  background-color: #d9f3c7;
  font-size: 10px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.6;
  letter-spacing: 0.15px;
  text-align: center;
  color: #01630a;
`;

const ActivityFeedList = ({ activityFeed }: Props) => {
  return (
    <>
      <h5 style={{ marginBottom: '24px' }}>Activity Feed</h5>
      <StyledActivityList>
        {activityFeed.map((activity, index) => (
          <StyledActivityItem key={`${activity._id}-${index}`}>
            <span>{activity._id}</span>
            <p>{activity._id}</p>
            <StyledChip>{activity.latestHistory.status}</StyledChip>
          </StyledActivityItem>
        ))}
      </StyledActivityList>
    </>
  );
};

export default ActivityFeedList;

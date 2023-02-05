import React, { useState, useEffect } from 'react';
import { ActivityFeed, getActivityFeed } from '../../services/management';

const ActivityFeedContainer = ({ render, renderLoading }: ContainerProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activityFeed, setActivityFeed] = useState<ActivityFeed | null>();

  useEffect(() => {
    getActivityFeed()
      .then((response) => {
        setActivityFeed(response);
        setIsLoading(false);
      })
      .catch(() => setActivityFeed(null));
  }, []);

  if (isLoading || !activityFeed) return renderLoading();

  return render({ activityFeed });
};

export default ActivityFeedContainer;

type ContainerProps = {
  render: (args: ActivityFeedList) => JSX.Element;
  renderLoading: () => JSX.Element;
};

export type ActivityFeedList = {
  activityFeed: ActivityFeed;
};

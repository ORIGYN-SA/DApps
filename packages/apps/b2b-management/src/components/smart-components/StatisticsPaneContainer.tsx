import React, { useState, useEffect } from 'react';
import { Statistics, getStatistics } from '../../services/management';

const StatisticsPaneContainer = ({ render, renderLoading }: ContainerProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statistics, setStatistics] = useState<Statistics | null>();

  useEffect(() => {
    getStatistics()
      .then((response) => {
        setStatistics(response);
        setIsLoading(false);
      })
      .catch(() => setStatistics(null));
  }, []);

  if (isLoading || !statistics) return renderLoading();

  return render({ statistics });
};

export default StatisticsPaneContainer;

type ContainerProps = {
  render: (args: StatisticsPane) => JSX.Element;
  renderLoading: () => JSX.Element;
};

export type StatisticsPane = {
  statistics: Statistics;
};

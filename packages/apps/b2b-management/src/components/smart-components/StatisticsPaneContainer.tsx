import React, { useState, useEffect } from 'react';
import { Statistics, getStatistics } from '../../services/management';

const StatisticsPaneContainer = ({ render, renderLoading }: ContainerProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statistics, setStatistics] = useState<Statistics | null>();
  const [days, setDays] = useState<number>(30);

  useEffect(() => {
    getStatistics(days)
      .then((response) => {
        setStatistics(response);
        setIsLoading(false);
      })
      .catch(() => setStatistics(null));
  }, []);

  useEffect(() => {
    setIsLoading(true);
    getStatistics(days)
      .then((response) => {
        setStatistics(response);
        setIsLoading(false);
      })
      .catch(() => setStatistics(null));
  }, [days]);

  if (isLoading || !statistics) return renderLoading();

  return render({ statistics, onFrameChange: setDays, frameAsDays: days });
};

export default StatisticsPaneContainer;

type ContainerProps = {
  render: (args: StatisticsPane) => JSX.Element;
  renderLoading: () => JSX.Element;
};

export type StatisticsPane = {
  frameAsDays: number;
  onFrameChange: (days: number) => void;
  statistics: Statistics;
};

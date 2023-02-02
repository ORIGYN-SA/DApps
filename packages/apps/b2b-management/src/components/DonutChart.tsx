import React from 'react';
import CDonutChart from 'simple-react-donut-chart';
import 'simple-react-donut-chart/src/style.css';
import './DonutChart.css';

const DonutChart = ({ percentage }) => {
  return (
    <CDonutChart
      percentage={percentage}
      colorOff="#2dbd80"
      colorOn="#f2bd00"
      labelOn="Unclaimed"
      labelOff="Claimed"
      circleColor="#ffffff"
      baseClass="customize"
      textStyle={{
        display: 'none',
      }}
      labelStyle={{
        off: {
          fontSize: '16px',
        },
        on: {
          fontSize: '18px',
        },
      }}
    />
  );
};

export default DonutChart;

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function LineChart(props) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
          ticks: {
              // Include a dollar sign in the ticks
              callback: function(value, index, ticks) {
                  return '$' + value;
              }
          }
      }
  },
    plugins: {
      legend: {
        position: 'top'
      }
    },
    animations: {
      tension: {
        duration: 1000,
        easing: 'linear',
        from: 1,
        to: 0,
        loop: false
      }
    },
  };
  const labels = props.label;
  const data = {
    labels: labels,
    datasets: [
      {
        label: props.dataset,
        data: props.data,
        borderColor: props.color.rgba,
        backgroundColor: props.color.rgba,
      }
    ]
  };
  return <Line options={options} data={data} />;
}

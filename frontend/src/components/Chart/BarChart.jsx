import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = (props) => {
  const labels = props.label;
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      },
    }
  };
  const data = {
    labels: labels,
    datasets: [
      {
        label: props.dataset,
        data: props.data,
        backgroundColor: props.color.rgba,
      }
    ],
  };
    return(
      <Bar options={options} data={data}/>
    );
}
export default BarChart;

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
  
  function extractDate(label, level) {
    const date = new Date(label);
    if (level === 'year') {
      return `${date.getFullYear()}`;
    } else if (level === 'month') {
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    } else if (level === 'date') {
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    }
    return label; // Default to returning the original label if level is not recognized
  }

  // Group data by extracted date or month and calculate averages
  function groupDataByDate(dataLabels, dataValues, level) {
      const groupedData = {};
      const countData = {};

      dataLabels.forEach((label, index) => {
          const key = extractDate(label, level);
          if (!groupedData[key]) {
              groupedData[key] = 0;
              countData[key] = 0;
          }
          console.log(typeof(dataValues[index]));
          groupedData[key] += parseFloat(dataValues[index]);
          countData[key]++;
      });

      const labels = Object.keys(groupedData);
      const averages = labels.map(key => (groupedData[key] / countData[key]).toFixed(2));

      console.log(labels, averages);

      return {
          labels: labels,
          averages: averages
      };
  }
  const groupedByMonth = groupDataByDate(props.label, props.data, props.level);

  const labels = groupedByMonth.labels;
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: 'top'
      },
    }
  };
  const data = {
    labels: labels,
    datasets: [
      {
        label: props.dataset,
        data: groupedByMonth.averages,
        backgroundColor: props.color.rgba,
      }
    ],
  };
    return(
      <Bar options={options} data={data}/>
    );
}
export default BarChart;

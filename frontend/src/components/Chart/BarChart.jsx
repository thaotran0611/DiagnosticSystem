import React, { useState } from 'react';
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
  const [clickedIndex, setClickedIndex] = useState(null);
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
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: props.unitY // Unit for the y-axis
        }
      }
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const datasetIndex = elements[0].datasetIndex;
        const value = data.datasets[datasetIndex].data[index];
        const label = data.labels[index];
        setClickedIndex(index);
        if (props.setDecision) {
          props.setDecision(label);
        }
        if (props.setChangeChart) {
          props.setChangeChart(2);
        }
      } else {
        setClickedIndex(null);
        if (props.setDecision) {
          props.setDecision('All');
        }
      }
    },
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
  const customData = {
    ...data,
    datasets: data.datasets.map((dataset, datasetIndex) => {
      return {
        ...dataset,
        backgroundColor: dataset.data.map((_, dataIndex) => props.changeChart ? dataIndex === clickedIndex && props.changeChart === 2 ? 'red' : props.color.rgba : dataIndex === clickedIndex ? 'red' : props.color.rgba)
      };
    })
  };
  return(
    <Bar options={options} data={customData}/>
  );
}
export default BarChart;

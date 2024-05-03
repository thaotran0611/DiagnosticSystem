import React, { useState } from 'react';
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
  const [clickedIndex, setClickedIndex] = useState(null);
  console.log(props.data);
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
          groupedData[key] += parseFloat(dataValues[index]);
          countData[key]++;
      });

      const labels = Object.keys(groupedData);
      const averages = labels.map(key => (groupedData[key] / countData[key]).toFixed(2));

      return {
          labels: labels,
          averages: averages
      };
  }
  const groupedByMonth = groupDataByDate(props.label, props.data, props.level);
  const options = {
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const datasetIndex = elements[0].datasetIndex;
        const value = data.datasets[datasetIndex].data[index];
        const label = data.labels[index];
        console.log(`Clicked on data point ${label} with value ${value}`);
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
  const labels = groupedByMonth.labels;
  const data = {
    labels: labels,
    datasets: [
      {
        label: props.dataset,
        data: groupedByMonth.averages,
        borderColor: props.color ? props.color.rgba : '#ccc',
        backgroundColor: props.color ? props.color.rgba : '#ccc',
      }
    ]
  };

  const customData = {
    ...data,
    datasets: data.datasets.map((dataset, datasetIndex) => {
      return {
        ...dataset,
        pointBackgroundColor: dataset.data.map((_, dataIndex) => props.changeChart ? dataIndex === clickedIndex && props.changeChart === 2 ? 'red' : props.color.rgba : props.color.rgba)
      };
    })
  };
  return <Line options={options} data={customData} />;
}

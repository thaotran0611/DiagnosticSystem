import React, { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Box } from '@chakra-ui/react';

ChartJS.register(ArcElement, Tooltip, Legend);



export function PieChart(props) {
  const [clickedIndex, setClickedIndex] = useState(null);
  const generateRandomColor = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  };
  // const borderColor = Array.from({ length: props?.data?.length }, () => generateRandomColor());
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
          props.setChangeChart(1);
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
          position: 'right',
        },
        title: {
          display: false,
          // text: 'Chart.js Pie Chart'
        },
    }
  }
  
  const data = {
    labels: props.labels,
    datasets: [
      {
        label: '# of Votes',
        data: props.data,
        backgroundColor: props.scheme,
        borderColor: '#fff',
        borderWidth: 3,
      },
    ],
  };
  // const customData = {
  //   ...data,
  //   datasets: data.datasets.map((dataset, datasetIndex) => {
  //     return {
  //       ...dataset,
  //       pointBackgroundColor: dataset.data.map((_, dataIndex) => props.changeChart ? dataIndex === clickedIndex && props.changeChart === 1 ? 'red' : generateRandomColor : generateRandomColor)
  //     };
  //   })
  // };
  const highlightedData = { ...data };
  if (clickedIndex !== null) {
    const borderColor = data.datasets[0].backgroundColor.map((color, index) =>
      props.changeChart ? index === clickedIndex && props.changeChart === 1 ? 'red' : '#fff' : '#fff'
    );
    highlightedData.datasets[0].borderColor = borderColor;
  }
  return (
    <Box display={'block'} height={'100%'} position={'relative'} overflow={'auto'}>
      <Pie data={highlightedData} options={options}/>
    </Box>
  );
}

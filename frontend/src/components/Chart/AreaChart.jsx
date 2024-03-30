import React, { useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
import { Button, Grid, GridItem, SimpleGrid } from '@chakra-ui/react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const generateData = () => {
    return Array.from({ length: 7 }, () => faker.datatype.number({ min: 0, max: 1000 }));
};

// export const options = {
//   responsive: true,
//   maintainAspectRatio: false,
//   plugins: {
//     legend: {
//       position: 'top',
//     },
//     title: {
//       display: true,
//       text: 'Biểu đồ đường Chart.js',
//     },
//   },
//   animations: {
//     tension: {
//       duration: 1000,
//       easing: 'linear',
//       from: 1,
//       to: 0,
//       loop: false
//     }
//   },
//   elements: {
//     line: {
//       tension: smooth ? 0.4 : 0
//     }
//   }

// };

const labels = ['Tháng Một', 'Tháng Hai', 'Tháng Ba', 'Tháng Tư', 'Tháng Năm', 'Tháng Sáu', 'Tháng Bảy'];

export const data = {
  labels,
  datasets: [
    {
        fill: true,
        label: 'Dataset 1',
        data: generateData(),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
    {
        fill: true,
        label: 'Dataset 2',
        data: generateData(),
        borderColor: 'rgb(53, 162, 0)',
        backgroundColor: 'rgba(53, 162, 0, 0.5)',
      },
  ],
};

export function AreaChart(props) {
    const [smooth, setSmooth] = useState(false);
    const [propagate, setPropagate] = useState(false);

    const handleRandomize = (chart) => {
        chart.data.datasets.forEach(dataset => {
          dataset.data = generateData();
        });
        chart.update();
    };
    
    const handlePropagate = (chart) => {
        setPropagate(prev => !prev);
        chart.options.plugins.filler.propagate = !propagate;
        chart.update();
    };
    
    const handleSmooth = (chart) => {
        setSmooth(prev => !prev);
        chart.options.elements.line.tension = smooth ? 0 : 0.4;
        chart.update();
    };

    const actions = [
        {
          name: 'Randomize',
          handler: handleRandomize
        },
        {
          name: 'Propagate',
          handler: handlePropagate
        },
        {
          name: 'Smooth',
          handler: handleSmooth
        }
    ];

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Biểu đồ đường Chart.js',
          },
          filler: {
            propagate: propagate
          }
        },
        animations: {
          tension: {
            duration: 1000,
            easing: 'linear',
            from: 1,
            to: smooth ? 0.4 : 0,
            loop: false
          }
        },
        // elements: {
        //   line: {
        //     tension: smooth ? 0.4 : 0
        //   }
        // }
      
    };
    const [chartdata, setChartData] = useState(data)
    const ChartRef = useRef(null);
    return (
        <Grid position= 'relative' width= '100%' height= '100%' gridTemplateRows={'80% 20%'}>
            <GridItem h={'100%'} overflow={'auto'} w={'100%'} position={'relative'}>
                <Line ref={ChartRef} height={50} width={100} options={options} data={chartdata} />
            </GridItem>
            <GridItem>
            <SimpleGrid columns={actions.length + 2} spacing={4}>
                {actions.map((action, index) => (
                <Button size={'xs'} colorScheme='blue' key={index} onClick={() => action.handler(ChartRef.current)}>{action.name}</Button>
                ))}
            </SimpleGrid>
            </GridItem>
        </Grid>
    );
}
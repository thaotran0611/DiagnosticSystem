import React from 'react';
import DiseaseStatistic from './DiseaseStatistic';
import { SimpleGrid } from '@chakra-ui/react'; // Import SimpleGrid component from Chakra UI

const data = [
    { name: 'Heart', Quantity: 200, Trend: 0.02 },
    { name: 'Lungs', Quantity: 200, Trend: -0.02 },
    { name: 'Obesity', Quantity: 200, Trend: -0.02 },
    { name: 'Depression', Quantity: 200, Trend: -0.02 },
    { name: 'Cancer', Quantity: 200, Trend: -0.02 },
    { name: 'Alcohol Abuse', Quantity: 200, Trend: 0.02 },
    { name: 'Chronic Pain', Quantity: 200, Trend: -0.02 },
    { name: 'Chronic Neurologic', Quantity: 200, Trend: 0.02 },
    { name: 'Psychiatric Disorder', Quantity: 200, Trend: 0.02 },
    { name: 'Substance Abuse', Quantity: 200, Trend: -0.02 },
];

const DiseaseList = () => {
    return (
        <SimpleGrid columns={2} spacingX={1} columnGap={4} align="center" justify="center" w={'90%'} overflow={'auto'}>
            {/* Render DiseaseStatistic for each data item */}
            {data.map((disease, index) => (
                <>
                    <DiseaseStatistic key={index} {...disease} />
                </>
            ))}
        </SimpleGrid>
    );
};

export default DiseaseList;

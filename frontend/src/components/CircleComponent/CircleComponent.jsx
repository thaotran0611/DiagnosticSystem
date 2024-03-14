import React from 'react';
import { Box } from '@chakra-ui/react';

const getSmallCircleColor = (gender) => {
    return gender === 'M' ? '#B9DDDF' : gender === 'F' ? 'rgba(221, 13, 63, 0.2)' : 'gray.500';
};
const getBigCircleColor = (gender) => {
    return gender === 'M' ? '#76C1C6' : gender === 'F' ? 'rgba(221, 13, 63)' : 'gray.500';
};
const CircleComponent = (props) => {
    const { gender } = props;  // Corrected line to use props.gender
    return (
        <Box
            w="60px"
            h="60px"
            borderRadius="full"
            borderColor={getBigCircleColor(gender)}
            borderWidth="2px"
            borderStyle="solid"
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
        >
            <Box
                w="50px"
                h="50px"
                borderRadius="full"
                bg={getSmallCircleColor(gender)}
                color="white"
                display="flex"
                alignItems="center"
                justifyContent="center"
                position="absolute"
                mr="4"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
            >
                {gender}
            </Box>
        </Box>
    );
};

export default CircleComponent;

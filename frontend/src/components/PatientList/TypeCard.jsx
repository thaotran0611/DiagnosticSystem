import React from 'react';
import { Box, Center, Text } from '@chakra-ui/react';

const getTextColor = (type) => {
    
    switch (type) {
        case 'ELECTIVE':
          return '#F6E120';
        case 'EMERGENCY':
        case 'URGENT':
          return '#F62020';
        case 'NEWBORN':
          return '#4FD1C5';
        default:
          return 'DEFAULT_COLOR';
      }};
const getBackgroundColor = (type) => {
    return type === 'ELECTIVE' ? 'rgba(246, 225, 32, 0.20)' : type === 'EMERGENCY' ? 'rgba(246, 32, 32, 0.20)' : type === 'URGENT' ? 'rgba(246, 32, 32, 0.20)' : '#E6FFFA';
};

const TypeCard = (props)  =>{
    return (
        <Center >
            <Box
                pl={3}
                pr={3}
                borderRadius="full"
                fontWeight="bold" 
                color = {getTextColor(props.type)}
                bg = {getBackgroundColor(props.type)}
                >
                {props.type}
            </Box>
        </Center>
        
    )
}

export default TypeCard;
import React from 'react';
import { Box, Center, Text } from '@chakra-ui/react';

const getTextColor = (props) => {
    
    return props.type === 'ELECTIVE' ? '#F6E120' : props.type === 'EMERGENCY' ? '#F62020' : props.type === 'URGENT' ? '#F62020' : '#F6E120';
};
const getBackgroundColor = (props) => {
    return props.type === 'ELECTIVE' ? 'rgba(246, 225, 32, 0.20)' : props.type === 'EMERGENCY' ? 'rgba(246, 32, 32, 0.20)' : props.type === 'URGENT' ? 'rgba(246, 32, 32, 0.20)' : 'rgba(246, 225, 32, 0.20)';
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
import React from 'react';
import { Box, Image, Text, Flex, Stack ,Center } from '@chakra-ui/react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const imagePaths = {
  Lungs: 'https://cdn-icons-png.flaticon.com/512/508/508778.png',
  Heart: 'https://cdn-icons-png.flaticon.com/512/1365/1365806.png',
  Obesity: 'https://cdn-icons-png.flaticon.com/512/10038/10038625.png',
  Depression: 'https://cdn-icons-png.flaticon.com/512/10036/10036298.png',
  Cancer: 'https://cdn-icons-png.flaticon.com/512/8870/8870384.png',
  'Alcohol Abuse': 'https://cdn-icons-png.flaticon.com/512/8804/8804463.png',
  'Chronic Pain': 'https://cdn-icons-png.flaticon.com/128/5800/5800110.png',
  'Chronic Neurologic': 'https://t4.ftcdn.net/jpg/04/66/36/39/240_F_466363996_ICn5MrDB5avOpHrc5CgwuqEeuJpknVfE.jpg',
  'Psychiatric Disorder': 'https://cdn-icons-png.flaticon.com/128/1993/1993383.png',
  'Substance Abuse': 'https://cdn-icons-png.flaticon.com/128/12310/12310299.png'
};

const DiseaseStatistic = (props) => {
  return (
    <Stack direction="row" spacing="20" align="center">
      <Stack direction="column" align="center" mb="2" w={100}>
        <Box>
            <Image src={imagePaths[props.name]} alt={`Card Image for ${props.name}`} boxSize="50px"/>
        </Box>
        <Box boxSize={50}>
            <Center> 
                <Text fontSize="md" fontWeight="semibold" mb="2" textAlign="center">
                {props.name}
                </Text>
            </Center>
        </Box>
      </Stack>
      <Text mr="1" fontSize="2xl">{props.Quantity} patients</Text>

      <Flex align="center" justify="center">
        <Flex align="center">
          {props.Trend > 0 ? <FaArrowUp color="green" /> : <FaArrowDown color="red" />}
          <Text ml="1" fontSize="xl">{Math.abs(props.Trend * 100).toFixed(2)}%</Text>
        </Flex>
      </Flex>
    </Stack>
  );
};

export default DiseaseStatistic;

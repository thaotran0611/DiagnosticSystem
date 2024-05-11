import React from 'react';
import { Box, Image, Text, Flex, Stack ,Center, Spacer, HStack } from '@chakra-ui/react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { BsGenderFemale, BsGenderMale } from "react-icons/bs";

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
  console.log(props);
  return (
    <Stack onClick={() => props.handleClickDisease(props.data)} w={props.width} direction="row" spacing="20" align="center" border={'1px solid #ccc'} borderRadius={'20px'} _hover={{ bg: 'rgba(217, 217, 217, 0.3)' , borderRadius: "20px"}}>
      <Stack direction="column" align="center" mb="2">
        <Box>
            <Image src={imagePaths[props.data.disease_name]} alt={`Card Image for ${props.data.disease_name}`} boxSize="70px"/>
        </Box>
        <Box w={200} >
            <Center> 
                <Text fontSize="md" fontWeight="semibold" mb="2" textAlign="center">
                {props.data.disease_name}
                </Text>
            </Center>
        </Box>
      </Stack>
      <Text mr="1" fontSize="2xl">{props.data.sum_of_admission} patients</Text>

      <Flex>
        <HStack spacing={4} align="center">
          <Flex justify={'center'} align={'center'}><BsGenderMale color='blue'/> <Text ml="1" fontSize="xl">{Math.abs((props.data.sum_of_male/props.data.sum_of_admission)*100).toFixed(1)}%</Text></Flex>
          <Flex justify={'center'} align={'center'}><BsGenderFemale color='red'/> <Text ml="1" fontSize="xl">{Math.abs((props.data.sum_of_female/props.data.sum_of_admission)*100).toFixed(1)}%</Text></Flex>
        </HStack>
      </Flex>
    </Stack>
  );
};

export default DiseaseStatistic;
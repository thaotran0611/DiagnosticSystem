import React from 'react';
import { Box, Image, Text, Flex, Stack ,Center, Spacer, HStack, Icon } from '@chakra-ui/react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { BsGenderFemale, BsGenderMale } from "react-icons/bs";
import { GiMedicines } from "react-icons/gi";
const imagePaths = {
  Lungs: 'https://cdn-icons-png.flaticon.com/512/508/508778.png',
};

const DrugStatistic = (props) => {
  return (
    <Stack onClick={() => props.handleClickMedicine(props.data)} w={props.width} direction="row" spacing="20" align="center" border={'1px solid #ccc'} borderRadius={'20px'} _hover={{ bg: 'rgba(217, 217, 217, 0.3)' , borderRadius: "20px"}}>
      <Stack direction="column" align="center" mb="2">
        <Box>
          <Icon boxSize={10} as={GiMedicines}/>
        </Box>
        <Box w={200} >
            <Center> 
                <Text fontSize="md" fontWeight="semibold" mb="2" textAlign="center">
                {`${props.data.drug} ${props.data.drug_type} ${props.data.formulary_drug_cd}`}
                </Text>
            </Center>
        </Box>
      </Stack>
      <Text mr="1" fontSize="2xl">prescribed {props.data.sum_of_admission} times</Text>

      <Flex>
        <HStack spacing={4} align="center">
          <Flex justify={'center'} align={'center'}><BsGenderMale color='blue'/> <Text ml="1" fontSize="xl">{Math.abs((props.data.sum_of_male/props.data.sum_of_admission)*100).toFixed(1)}%</Text></Flex>
          <Flex justify={'center'} align={'center'}><BsGenderFemale color='red'/> <Text ml="1" fontSize="xl">{Math.abs((props.data.sum_of_female/props.data.sum_of_admission)*100).toFixed(1)}%</Text></Flex>
        </HStack>
      </Flex>
    </Stack>
  );
};

export default DrugStatistic;
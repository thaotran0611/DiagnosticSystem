import CircleComponent from '../CircleComponent/CircleComponent' 
import TypeCard from '../PatientList/TypeCard';
import React, {useState} from 'react'; 
import { Card, CardBody, StackDivider, Stack, Text,SimpleGrid, Spacer, Flex } from '@chakra-ui/react'; 
 
const PatientGridCard = (props) => { 
    let keyValueList = []; // Initialize keyValueList as an empty array
    if (props.data !== null) {
      keyValueList = Object.entries(props.data).slice(7).map(([key, value]) => {
        return { key: key, value: value };
      });
    }
    const halfIndex = Math.ceil(keyValueList.length / 2);
    const handleClick = () => {
        props.onClick(props.data.subject_id);
    };
  return ( 
    <Card w={750} onClick={handleClick} height={250} border="1px solid #B9DDDF" borderRadius="20px"> 
      <CardBody  p="4" m='2'  overflowY="auto" sx={{
                    '&::-webkit-scrollbar': {
                    width: '5px', // Set the width of the scrollbar
                    height: '5px'
                    },
                    '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'gray.400', // Set the color of the scrollbar thumb
                    borderRadius: 'full', // Set the border radius of the thumb to make it round
                    },
                }}> 
        <Stack divider={<StackDivider />} spacing="4"> 
          <Flex> 
                <CircleComponent gender = {props.data.gender} /> 
                <Flex ml = {2} direction="column"> 
                    <Text margin={0} fontWeight="bold" >{props.data.name}</Text> 
                    <Text margin={0}>{props.data.dob}</Text> 
                </Flex>
                <Spacer />
                <TypeCard type={props.data.admission_type}/>
            </Flex> 
            
            <Flex> {/* Use Flex container */}
                        <Flex direction="column" flex="1"  alignItems="flex-start"> {/* Set flex="1" to make it grow */}
                            {keyValueList ? keyValueList.slice(0, halfIndex).map((item, index) => ( 
                                <Flex key={index} justifyContent="space-between" alignItems="flex-start"  my={1}> 
                                    <Text fontWeight="bold">{item.key}:</Text> 
                                    <Text>{item.value}</Text> 
                                </Flex> 
                            )): null} 
                        </Flex>
                        <Flex direction="column" flex="1"  alignItems="flex-start"> {/* Set flex="1" to make it grow */}
                            {keyValueList ? keyValueList.slice(halfIndex).map((item, index) => ( 
                                <Flex key={index} justifyContent="space-between" alignItems="flex-start"  my={1}>
                                    <Text fontWeight="bold">{item.key}:</Text> 
                                    <Text>{item.value}</Text> 
                                </Flex> 
                            )): null} 
                        </Flex>  
                    </Flex>
        </Stack> 
      </CardBody> 
    </Card> 
  ); 
}; 
 
export default PatientGridCard;

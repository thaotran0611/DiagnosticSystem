import CircleComponent from '../CircleComponent/CircleComponent' 
import TypeCard from '../PatientList/TypeCard';
import React from 'react'; 
import { Card, CardBody, StackDivider, Stack, Text,SimpleGrid, Spacer, Flex } from '@chakra-ui/react'; 
 
const PatientGridCard = (props) => { 
    const data = [ 
        { key: 'Ethnicity', value: 'Asian' }, 
        { key: 'Addmission date', value: '12/12/2012' }, 
        { key: 'Discharge date', value: '20/12/2012' }, 
        { key: 'Marital status', value: 'Emergency' }, 
        { key: 'Insurance', value: 'Private' }, 
        { key: 'Diagnose', value: 'Overdose' }, 
      ]; 
    const gender = 'M' 
    const halfIndex = Math.ceil(data.length / 2);
    const type = 'NEWBORN'
  return ( 
    <Card w={600}> 
      <CardBody border="1px solid #B9DDDF" borderRadius="20px" p="4" m='2'> 
        <Stack divider={<StackDivider />} spacing="4"> 
          <Flex> 
                <CircleComponent gender = {gender} /> 
                <Flex ml = {2} direction="column"> 
                    <Text margin={0} fontWeight="bold" >Alisha John - 12345</Text> 
                    <Text margin={0}>01/02/2002</Text> 
                </Flex>
                <Spacer />
                <TypeCard type={type}/>
            </Flex> 

            <SimpleGrid columns={2} spacing={2}> 
                <SimpleGrid columns={2} spacing={2}> 
                    {data.slice(0, halfIndex).map((item, index) => ( 
                    <React.Fragment key={index}> 
                        <Text fontWeight="bold">{item.key}:</Text> 
                        <Text>{item.value}</Text> 
                    </React.Fragment> 
                    ))} 
                </SimpleGrid>
                <SimpleGrid columns={2} spacing={2}> 
                    {data.slice(halfIndex).map((item, index) => ( 
                    <React.Fragment key={index}> 
                        <Text fontWeight="bold">{item.key}:</Text> 
                        <Text>{item.value}</Text> 
                    </React.Fragment> 
                    ))} 
                </SimpleGrid>  
            </SimpleGrid> 
        </Stack> 
      </CardBody> 
    </Card> 
  ); 
}; 
 
export default PatientGridCard;

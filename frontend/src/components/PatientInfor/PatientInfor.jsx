import CircleComponent from '../CircleComponent/CircleComponent' 
import DiseaseCard from '../DiseaseCard/DiseaseCard' 
import React from 'react'; 
import { Card, CardHeader, CardBody, Box, StackDivider, Stack, Heading, Text, CardFooter,Button,SimpleGrid, Divider, Flex } from '@chakra-ui/react'; 
 
const PatientInfor = (props) => { 
    const data = [ 
        { key: 'Ethnicity', value: 'England' }, 
        { key: 'Addmission date', value: '12/12/2012' }, 
        { key: 'Discharge date', value: '20/12/2012' }, 
        { key: 'Addmission type', value: 'Emergency' }, 
        { key: 'Addmission location', value: 'EMERGENCY ROOM ADMIT' }, 
      ]; 
    const gender = 'M' 
    const diseaseList = ['Lungs','Heart']
  return ( 
    <Card width={500}> 
      <CardHeader> 
        <Heading size="md">Patient's Information</Heading> 
      </CardHeader> 
 
      <CardBody border="1px solid #B9DDDF" borderRadius="20px" p="4" m='2'> 
        <Stack divider={<StackDivider />} spacing="4"> 
          <Flex> 
                <CircleComponent gender = {gender} /> 
                <Flex ml = {2} direction="column"> 
                    <Text margin={0} fontWeight="bold" >Alisha John - 12345</Text> 
                    <Text margin={0}>01/02/2002</Text> 
                </Flex> 
            </Flex> 

          <Stack direction="row" spacing="4" p="2" m='0'>
            {diseaseList.map((disease, index) => (
              <DiseaseCard key={index} text={disease} />
            ))}
          </Stack>

            <SimpleGrid columns={2} spacing={3}> 
                {data.map((item, index) => ( 
                <React.Fragment key={index}> 
                    <Text fontWeight="bold">{item.key}:</Text> 
                    <Text>{item.value}</Text> 
                </React.Fragment> 
                ))} 
            </SimpleGrid> 
        </Stack> 
      </CardBody> 
      <CardFooter> 
        <Box ml="auto"> 
          <Button bg="#3E36B0" color="white">Detail</Button> 
        </Box> 
      </CardFooter> 
    </Card> 
  ); 
}; 
 
export default PatientInfor;
